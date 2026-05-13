import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ApplicationStatus = sequelize.define("ApplicationStatus", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

export default ApplicationStatus;