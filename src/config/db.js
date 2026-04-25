//ky file ben lidhjen e node.js me PostgreSQL

import { Sequelize } from "sequelize"; //ORM
import dotenv from "dotenv"; //lexon .env file

dotenv.config(); //i aktivizojme variablat nga .env


//krijimi i connection me db
const sequelize = new Sequelize(  
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  //konfigurimi 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false
  }
);
//pra krijon connection objekt

export default sequelize;
//e ben te perdorshme ne models dhe server.js