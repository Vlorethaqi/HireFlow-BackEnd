import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Department = sequelize.define(
  "Department",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name", "companyId"]
      }
    ]
  }
);

export default Department;