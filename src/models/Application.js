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
        references: { model: 'Users', key: 'id' } 
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Jobs', key: 'id' }  
    },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,

        defaultValue: 1, 
        references: { model: 'ApplicationStatuses', key: 'id' } 
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Companies', key: 'id' } 
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



export default Application;
