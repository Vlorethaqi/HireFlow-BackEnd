import User from "./User.js";
import Company from "./Company.js";
import Department from "./Department.js";
import Job from "./Job.js";
import JobRequirement from "./JobRequirement.js";
import Skill from "./Skill.js";
import JobSkill from "./JobSkill.js";

Company.hasMany(User, {
    foreignKey: "companyId",
});

User.belongsTo(Company, {
    foreignKey: "companyId",
});

Department.hasMany(Job, {
  foreignKey: "departmentId",
});

Job.belongsTo(Department, {
  foreignKey: "departmentId",
});


Job.hasMany(JobRequirement, {
  foreignKey: "jobId",
});

JobRequirement.belongsTo(Job, {
  foreignKey: "jobId",
});

/* Job <-> Skill */
Job.belongsToMany(Skill, {
  through: JobSkill,
  foreignKey: "jobId",
});

Skill.belongsToMany(Job, {
  through: JobSkill,
  foreignKey: "skillId",
});

export {
User,
 Company,
  Department,
  Job,
  JobRequirement,
  Skill,
  JobSkill,
};
