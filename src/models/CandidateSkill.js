import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CandidateSkill = sequelize.define("CandidateSkill", {
  candidateProfileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  skillId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default CandidateSkill;