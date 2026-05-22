import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    location: {
      type: DataTypes.STRING
    },

    salaryMin: {
      type: DataTypes.FLOAT
    },

    salaryMax: {
      type: DataTypes.FLOAT
    },

    employmentType: {
      type: DataTypes.ENUM(
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
        "CONTRACT"
      ),
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("OPEN", "CLOSED"),
      defaultValue: "OPEN"
    },

    deadline: {
      type: DataTypes.DATE
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    departmentId: {
      type: DataTypes.INTEGER
    }
  },
  {
    timestamps: true,
    indexes: [
      { fields: ["title"] },
      { fields: ["location"] },
      { fields: ["status"] }
    ]
  }
);

export default Job;
