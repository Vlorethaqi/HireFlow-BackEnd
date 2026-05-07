import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Company = sequelize.define("Company", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

export default Company;