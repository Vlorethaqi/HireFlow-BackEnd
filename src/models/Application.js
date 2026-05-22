import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Importon lidhjen direkte me DB si te modelet e tjera

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1 // Default: 1 (psh. 'Applied')
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false // Multi-Tenancy
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

// Lidhjet (References)
Application.associate = (models) => {
    Application.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Application.belongsTo(models.Job, { foreignKey: 'jobId', as: 'job' });
    Application.belongsTo(models.ApplicationStatus, { foreignKey: 'statusId', as: 'status' });
    Application.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
};

export default Application;