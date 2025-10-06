import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config()

const sequelize = new Sequelize(
    "erbdb",
    "erbadmin",
    "admin@NSE#256",
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: true
    } );

export default sequelize;