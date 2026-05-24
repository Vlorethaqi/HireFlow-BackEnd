import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ApplicationDocument = sequelize.define("ApplicationDocument", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  applicationId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  documentType: {
    type: DataTypes.ENUM("CV", "COVER_LETTER", "CERTIFICATE", "OTHER"),
    defaultValue: "OTHER"
  },

  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default ApplicationDocument;