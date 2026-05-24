import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' } // 🌟 Shtohet referenca e pastër
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Jobs', key: 'id' }  // 🌟 Shtohet referenca e pastër
    },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Companies', key: 'id' } // 🌟 Shtohet referenca e pastër
    },
    coverLetter: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    appliedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'Applications'
});

// 🔥 U hoq blloku 'Application.associate' sepse ju i keni lidhjet manuale te index.js

export default Application;
