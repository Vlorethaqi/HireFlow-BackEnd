import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM(
        "ADMIN",
        "CANDIDATE",
        "HR",
        "WORKER"
      ),
      defaultValue: "CANDIDATE"
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    timestamps: true,

    defaultScope: {
      attributes: {
        exclude: ["password"]
      }
    }
  }
);

export default User;
