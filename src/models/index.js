import User from "./User.js";
import Company from "./Company.js";
import Job from "./Job.js";
import Department from "./Department.js";
import JobRequirement from "./JobRequirement.js";
import Skill from "./Skill.js";
import JobSkill from "./JobSkill.js";
import CandidateProfile from "./CandidateProfile.js";
import ApplicationStatus from "./ApplicationStatus.js";

Company.hasMany(User, {
    foreignKey: "companyId",
});

User.belongsTo(Company, {
    foreignKey: "companyId",
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



export {
    User,
    Company,
     CandidateProfile,
     ApplicationStatus,
};
