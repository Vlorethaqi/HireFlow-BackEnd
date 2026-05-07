import User from "./User.js";
import Company from "./Company.js";

Company.hasMany(User, {
    foreignKey: "companyId",
});

User.belongsTo(Company, {
    foreignKey: "companyId",
});

export {
    User,
    Company,
};