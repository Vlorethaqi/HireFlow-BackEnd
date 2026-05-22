import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const RolePermission = sequelize.define("RolePermission", {
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default RolePermission;
