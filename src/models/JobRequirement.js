import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const JobRequirement = sequelize.define(
  "JobRequirement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    requirementText: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    requirementType: {
      type: DataTypes.ENUM(
        "EDUCATION",
        "EXPERIENCE",
        "SKILL",
        "CERTIFICATION",
        "OTHER"
      ),
      defaultValue: "OTHER"
    },

    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: true
  }
);

export default JobRequirement;