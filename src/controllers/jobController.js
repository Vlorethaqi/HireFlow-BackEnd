import { Op } from "sequelize";
import { Department, Job, JobRequirement, JobSkill, Skill } from "../models/index.js";

const toNumber = (value) => {
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
};

export const getAllJobs = async (req, res) => {
  try {
    const hasFilters = Object.keys(req.query).length > 0;

    if (!hasFilters) {
      const jobs = await Job.findAll();
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

    res.json({
      data: jobs.rows,
      pagination: {
        total: jobs.count,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(jobs.count / limitNumber),
      },
      filters: req.query,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
