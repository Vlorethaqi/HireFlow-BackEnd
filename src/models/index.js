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

export {
    User,
    Company,
    Role,
    Permission,
    RolePermission,
};
Department.hasMany(Job);
Job.belongsTo(Department);

Job.hasMany(JobRequirement);
JobRequirement.belongsTo(Job);

Job.belongsToMany(Skill, { through: JobSkill });
Skill.belongsToMany(Job, { through: JobSkill });
