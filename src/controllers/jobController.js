import { Op } from "sequelize";
import sequelize from "../config/db.js";
import { AuditLog, Department, Job, JobRequirement, JobSkill, Skill } from "../models/index.js";
import { cacheKeys, deleteCachePattern, getCache, setCache } from "../services/cache.service.js";

const toNumber = (value) => {
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
};

export const getAllJobs = async (req, res) => {
  try {
    const key = cacheKeys().jobsQuery(req.query);
    const cachedJobs = await getCache(key);

    if (cachedJobs) {
      return res.json(cachedJobs);
    }

    const hasFilters = Object.keys(req.query).length > 0;

    if (!hasFilters) {
      const jobs = await Job.findAll({
        include: [
          { model: Department, attributes: ["id", "name", "companyId"], required: false },
          { model: JobRequirement, attributes: ["id", "requirementText", "requirementType", "isRequired"], required: false },
          {
            model: Skill,
            attributes: ["id", "name", "category", "description"],
            through: { model: JobSkill, attributes: ["importanceLevel"] },
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      await setCache(key, jobs, 120);
      return res.json(jobs);
    }

    const {
      search,
      status,
      employmentType,
      location,
      companyId,
      departmentId,
      departmentName,
      skillId,
      skill,
      skillCategory,
      minSalary,
      maxSalary,
      deadlineFrom,
      deadlineTo,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const where = {};
    const departmentWhere = {};
    const skillWhere = {};
    const pageNumber = Math.max(toNumber(page) || 1, 1);
    const limitNumber = Math.min(Math.max(toNumber(limit) || 10, 1), 100);

    if (status) {
      where.status = status;
    }

    if (employmentType) {
      where.employmentType = employmentType;
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (companyId && toNumber(companyId) !== null) {
      where.companyId = toNumber(companyId);
    }

    if (departmentId && toNumber(departmentId) !== null) {
      where.departmentId = toNumber(departmentId);
    }

    if (departmentName) {
      departmentWhere.name = { [Op.iLike]: `%${departmentName}%` };
    }

    if (skillId && toNumber(skillId) !== null) {
      skillWhere.id = toNumber(skillId);
    }

    if (skill) {
      skillWhere.name = { [Op.iLike]: `%${skill}%` };
    }

    if (skillCategory) {
      skillWhere.category = skillCategory;
    }

    if (minSalary || maxSalary) {
      where[Op.and] = where[Op.and] || [];

      if (minSalary) {
        where[Op.and].push({
          [Op.or]: [
            { salaryMin: { [Op.gte]: toNumber(minSalary) } },
            { salaryMax: { [Op.gte]: toNumber(minSalary) } },
          ],
        });
      }

      if (maxSalary) {
        where[Op.and].push({
          [Op.or]: [
            { salaryMin: { [Op.lte]: toNumber(maxSalary) } },
            { salaryMax: { [Op.lte]: toNumber(maxSalary) } },
          ],
        });
      }
    }

    if (deadlineFrom || deadlineTo) {
      where.deadline = {};

      if (deadlineFrom) {
        where.deadline[Op.gte] = new Date(deadlineFrom);
      }

      if (deadlineTo) {
        where.deadline[Op.lte] = new Date(deadlineTo);
      }
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { "$Department.name$": { [Op.iLike]: `%${search}%` } },
        { "$Skills.name$": { [Op.iLike]: `%${search}%` } },
        { "$JobRequirements.requirementText$": { [Op.iLike]: `%${search}%` } },
      ];
    }

    const allowedSortFields = ["createdAt", "deadline", "title", "salaryMin", "salaryMax"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const safeSortOrder = String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const jobs = await Job.findAndCountAll({
      where,
      include: [
        {
          model: Department,
          attributes: ["id", "name", "companyId"],
          where: departmentWhere,
          required: Boolean(departmentName),
        },
        {
          model: JobRequirement,
          attributes: ["id", "requirementText", "requirementType", "isRequired"],
          required: false,
        },
        {
          model: Skill,
          attributes: ["id", "name", "category", "description"],
          through: {
            model: JobSkill,
            attributes: ["importanceLevel"],
          },
          where: skillWhere,
          required: Boolean(skillId || skill || skillCategory),
        },
      ],
      distinct: true,
      subQuery: false,
      limit: limitNumber,
      offset: (pageNumber - 1) * limitNumber,
      order: [[safeSortBy, safeSortOrder]],
    });

    const payload = {
      data: jobs.rows,
      pagination: {
        total: jobs.count,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(jobs.count / limitNumber),
      },
      filters: req.query,
    };

    await setCache(key, payload, 120);
    res.json(payload);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createJob = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Company is required to create a job.",
      });
    }

    const { skills = [], requirements = [], ...jobData } = req.body;
    // DEADLINE VALIDATION
if (jobData.deadline) {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(jobData.deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  if (deadlineDate < today) {
    await transaction.rollback();

    return res.status(400).json({
      success: false,
      message: "Deadline date cannot be in the past.",
    });
  }
}

    if (!Array.isArray(skills) || skills.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "At least one required skill must be selected.",
      });
    }

    if (jobData.departmentId) {
      const department = await Department.findOne({
        where: {
          id: jobData.departmentId,
          companyId,
        },
        transaction,
      });

      if (!department) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Selected department does not belong to your company.",
        });
      }
    }

    const job = await Job.create({
      ...jobData,
      companyId,
    }, { transaction });

    if (Array.isArray(skills) && skills.length) {
      const jobSkills = skills.map((item) => ({
        jobId: job.id,
        skillId: typeof item === "object" ? item.skillId : item,
        importanceLevel: typeof item === "object" ? item.importanceLevel || "REQUIRED" : "REQUIRED",
      }));

      await JobSkill.bulkCreate(jobSkills, {
        transaction,
        ignoreDuplicates: true,
      });
    }

    if (Array.isArray(requirements) && requirements.length) {
      const jobRequirements = requirements.map((item) => ({
        jobId: job.id,
        requirementText: typeof item === "object" ? item.requirementText : item,
        requirementType: typeof item === "object" ? item.requirementType || "OTHER" : "OTHER",
        isRequired: typeof item === "object" ? item.isRequired ?? true : true,
      }));

      await JobRequirement.bulkCreate(jobRequirements, { transaction });
    }

    await AuditLog.create({
      userId: req.user.id,
      action: "JOB_CREATED",
      entity: "Job",
      entityId: job.id,
      companyId,
      description: `Job created: ${job.title}`,
    }, { transaction });

    await transaction.commit();
    await deleteCachePattern("jobs:query:*");

    const createdJob = await Job.findByPk(job.id, {
      include: [
        { model: JobRequirement },
        { model: Skill, through: { model: JobSkill, attributes: ["importanceLevel"] } },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: createdJob,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
