import { DataTypes } from "sequelize";  //importojme tipet e kolonave
import sequelize from "../config/db.js"; //bejme lidhjen me db permes sequelize

//krijimi i modelit
const User = sequelize.define("User", { 
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: {
    type: DataTypes.ENUM("ADMIN", "CANDIDATE"), 
    defaultValue: "CANDIDATE"
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

export default User; //e bejme per ta perdorur ne routes