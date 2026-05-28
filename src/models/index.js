import User from "./User.js";
import Company from "./Company.js";
import Department from "./Department.js";
import Job from "./Job.js";
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
import ApplicationReview from "./ApplicationReview.js";
import ApplicationResponse from "./ApplicationResponse.js";
import ApplicationDocument from "./ApplicationDocument.js";
import Notification from "./Notification.js";
import AuditLog from "./AuditLog.js";

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

User.hasMany(Application, {
    foreignKey: "userId",
});

Application.belongsTo(User, {
    foreignKey: "userId",
});

Company.hasMany(Department, {
    foreignKey: "companyId",
});

Department.belongsTo(Company, {
    foreignKey: "companyId",
});

Company.hasMany(Job, {
    foreignKey: "companyId",
});

Job.belongsTo(Company, {
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

Job.belongsToMany(Skill, {
    through: JobSkill,
    foreignKey: "jobId",
});

Skill.belongsToMany(Job, {
    through: JobSkill,
    foreignKey: "skillId",
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

Application.belongsTo(ApplicationStatus, {
  foreignKey: "statusId"
});

ApplicationStatus.hasMany(Application, {
  foreignKey: "statusId"
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

Application.hasMany(ApplicationReview, {
    foreignKey: "applicationId",
});

ApplicationReview.belongsTo(Application, {
    foreignKey: "applicationId",
});

User.hasMany(ApplicationReview, {
    foreignKey: "reviewerId",
});

ApplicationReview.belongsTo(User, {
    foreignKey: "reviewerId",
    as: "reviewer",
});

Company.hasMany(ApplicationReview, {
    foreignKey: "companyId",
});

ApplicationReview.belongsTo(Company, {
    foreignKey: "companyId",
});

Application.hasMany(ApplicationResponse, {
    foreignKey: "applicationId",
});

ApplicationResponse.belongsTo(Application, {
    foreignKey: "applicationId",
});

User.hasMany(ApplicationResponse, {
    foreignKey: "senderId",
});

ApplicationResponse.belongsTo(User, {
    foreignKey: "senderId",
    as: "sender",
});

Company.hasMany(ApplicationResponse, {
    foreignKey: "companyId",
});

ApplicationResponse.belongsTo(Company, {
    foreignKey: "companyId",
});

Application.hasMany(ApplicationDocument, {
    foreignKey: "applicationId",
});

ApplicationDocument.belongsTo(Application, {
    foreignKey: "applicationId",
});

Company.hasMany(ApplicationDocument, {
    foreignKey: "companyId",
});

ApplicationDocument.belongsTo(Company, {
    foreignKey: "companyId",
});

Company.hasMany(Application, {
    foreignKey: "companyId",
});

Application.belongsTo(Company, {
    foreignKey: "companyId",
});

User.hasMany(SavedJob, {
    foreignKey: "userId",
});

SavedJob.belongsTo(User, {
    foreignKey: "userId",
});

Job.hasMany(SavedJob, {
    foreignKey: "jobId",
});

SavedJob.belongsTo(Job, {
    foreignKey: "jobId",
});

User.hasMany(Notification, {
    foreignKey: "userId",
});

Notification.belongsTo(User, {
    foreignKey: "userId",
});

Company.hasMany(Notification, {
    foreignKey: "companyId",
});

Notification.belongsTo(Company, {
    foreignKey: "companyId",
});

User.hasMany(AuditLog, {
    foreignKey: "userId",
});

AuditLog.belongsTo(User, {
    foreignKey: "userId",
});

Company.hasMany(AuditLog, {
    foreignKey: "companyId",
});

AuditLog.belongsTo(Company, {
    foreignKey: "companyId",
});

export {
    User,
    Company,
    Role,
    Permission,
    RolePermission,
    Department,
    Job,
    JobRequirement,
    Skill,
    JobSkill,
    CandidateProfile,
    ApplicationStatus,
    CandidateSkill,
    Application,
    SavedJob,
    ApplicationReview,
    ApplicationResponse,
    ApplicationDocument,
    Notification,
    AuditLog,
};
