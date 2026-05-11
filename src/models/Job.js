import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  location: {
    type: DataTypes.STRING
  },

  salary: {
    type: DataTypes.FLOAT
  },

  status: {
    type: DataTypes.ENUM("OPEN", "CLOSED"),
    defaultValue: "OPEN"
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  departmentId: {
    type: DataTypes.INTEGER
  }
});

export default Job;