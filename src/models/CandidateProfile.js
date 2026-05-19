import { DataTypes } from "sequelize";
import sequelize from '../config/db.js';

const CandidateProfile = sequelize.define("CandidateProfile", {
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    experienceYears: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },

    education: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    cvUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    linkedinUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    githubUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default CandidateProfile;