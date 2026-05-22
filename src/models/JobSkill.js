import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const JobSkill = sequelize.define(
  "JobSkill",
  {
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    skillId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    importanceLevel: {
      type: DataTypes.ENUM(
        "REQUIRED",
        "PREFERRED"
      ),
      defaultValue: "REQUIRED"
    }
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["jobId", "skillId"]
      }
    ]
  }
);

export default JobSkill;