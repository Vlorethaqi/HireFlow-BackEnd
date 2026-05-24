import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AuditLog = sequelize.define("AuditLog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  action: {
    type: DataTypes.STRING,
    allowNull: false
  },

  entity: {
    type: DataTypes.STRING,
    allowNull: false
  },

  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default AuditLog;