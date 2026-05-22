import User from "./User.js";
import Company from "./Company.js";
import Job from "./Job.js";
import Department from "./Department.js";
import JobRequirement from "./JobRequirement.js";
import Skill from "./Skill.js";
import JobSkill from "./JobSkill.js";
import Role from "./Role.js";
import Permission from "./Permission.js";
import RolePermission from "./RolePermission.js";
import CandidateProfile from "./CandidateProfile.js";
import ApplicationStatus from "./ApplicationStatus.js";
import CandidateSkill from "./CandidateSkill.js";
import Application from "./Application.js";
import SavedJob from "./SavedJob.js";

Company.hasMany(User, {
    foreignKey: "companyId",
});

User.belongsTo(Company, {
    foreignKey: "companyId",
});

Company.hasMany(Role, {
    foreignKey: "companyId",
});

Role.belongsTo(Company, {
    foreignKey: "companyId",
});

Role.hasMany(User, {
    foreignKey: "roleId",
});

User.belongsTo(Role, {
    foreignKey: "roleId",
});

Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "roleId",
});

Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permissionId",
});

User.hasOne(CandidateProfile, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

CandidateProfile.belongsTo(User, {
    foreignKey: "userId",
});

Department.hasMany(Job);
Job.belongsTo(Department);

Job.hasMany(JobRequirement);
JobRequirement.belongsTo(Job);

Job.belongsToMany(Skill, {
    through: JobSkill,
});

Skill.belongsToMany(Job, {
    through: JobSkill,
});

CandidateProfile.hasMany(CandidateSkill, {
    foreignKey: "candidateProfileId",
});

CandidateSkill.belongsTo(CandidateProfile, {
    foreignKey: "candidateProfileId",
});

Skill.hasMany(CandidateSkill, {
    foreignKey: "skillId",
});

CandidateSkill.belongsTo(Skill, {
    foreignKey: "skillId",
});

ApplicationStatus.hasMany(Application, {
    foreignKey: "statusId",
});

Application.belongsTo(ApplicationStatus, {
    foreignKey: "statusId",
});

CandidateProfile.hasMany(Application, {
    foreignKey: "candidateProfileId",
});

Application.belongsTo(CandidateProfile, {
    foreignKey: "candidateProfileId",
});

Job.hasMany(Application, {
    foreignKey: "jobId",
});

Application.belongsTo(Job, {
    foreignKey: "jobId",
});

Company.hasMany(Application, {
    foreignKey: "companyId",
});

Application.belongsTo(Company, {
    foreignKey: "companyId",
});

export {
    User,
    Company,
    Role,
    Permission,
    RolePermission,
    Job,
    Department,
    JobRequirement,
    Skill,
    JobSkill,
    CandidateProfile,
    ApplicationStatus,
    CandidateSkill,
    Application,
    SavedJob,
};
