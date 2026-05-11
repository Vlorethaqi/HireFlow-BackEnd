import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const JobRequirement = sequelize.define("JobRequirement", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  requirement: {
    type: DataTypes.STRING,
    allowNull: false
  },

  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default JobRequirement;