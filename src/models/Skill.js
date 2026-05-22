import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Skill = sequelize.define(
  "Skill",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },

    category: {
      type: DataTypes.ENUM(
        "TECHNICAL",
        "SOFT",
        "LANGUAGE",
        "TOOL"
      ),
      defaultValue: "TECHNICAL"
    },

    description: {
      type: DataTypes.TEXT
    }
  },
  {
    timestamps: true
  }
);

export default Skill;