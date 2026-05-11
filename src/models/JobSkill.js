import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const JobSkill = sequelize.define("JobSkill", {
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  skillId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default JobSkill;