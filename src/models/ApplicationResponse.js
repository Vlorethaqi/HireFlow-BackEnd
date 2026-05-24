import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ApplicationResponse = sequelize.define("ApplicationResponse", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  applicationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM("ACCEPTED", "REJECTED", "INTERVIEW", "PENDING"),
    defaultValue: "PENDING"
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default ApplicationResponse;