const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    candidateProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CandidateProfiles',
            key: 'id'
        }
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false
        // references: { model: 'Jobs', key: 'id' } -> Lidhet me pjesën e Personit 2
    },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Default: 1 që do të thotë 'Applied' / 'I pranuar'
        references: {
            model: 'ApplicationStatuses',
            key: 'id'
        }
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false // Çdo aplikim i takon ekskluzivisht një kompanie (Tenant)
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

module.exports = Application;