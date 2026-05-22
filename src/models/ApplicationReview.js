import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ApplicationReview = sequelize.define("ApplicationReview", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  applicationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  recommendation: {
    type: DataTypes.ENUM("RECOMMENDED", "NOT_RECOMMENDED", "NEUTRAL"),
    defaultValue: "NEUTRAL"
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default ApplicationReview;