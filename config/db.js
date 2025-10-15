import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config()

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: true,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        },
    } );


export default sequelize;