// // import { Sequelize } from "sequelize";
// // import dotenv from "dotenv";
// // dotenv.config()

// // const sequelize = new Sequelize(
// //     process.env.DB_NAME,
// //     process.env.DB_USERNAME,
// //     process.env.DB_PASS,
// //     {
// //         host: process.env.DB_HOST,
// //         port: process.env.DB_PORT,
// //         dialect: "mysql",
// //         logging: true,
// //         dialectOptions: {
// //             ssl: {
// //                 rejectUnauthorized: false
// //             }
// //         },
// //     } );


// // export default sequelize;

// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";
// dotenv.config();

// // const sequelize = new Sequelize(
// //   process.env.DB_NAME,
// //   process.env.DB_USERNAME,
// //   process.env.DB_PASS,
// //   {
// //     host: process.env.DB_HOST,
// //     port: process.env.DB_PORT,
// //     dialect: "mysql",
// //     dialectOptions: {
// //       ssl: false,
// //     },
// //     logging: true,
// //   }
// // );
// export const sequelize = new Sequelize(
//   "erbdb",
//   "erbadmin",
//   "admin@NSE#256",
//   {
//     host: "localhost",
//     dialect: "mysql"
//   }
// );

// // Retry logic
// const connectWithRetry = async (retries = 10, delay = 5000) => {
//   while (retries) {
//     try {
//       console.log("🟢 Trying to connect to database...");
//       await sequelize.authenticate();
//       console.log("✅ Database connection established successfully.");
//       return true;
//     } catch (err) {
//       console.error(`❌ Database connection failed: ${err.message}`);
//       retries -= 1;
//       if (!retries) {
//         console.error("🚨 Out of retries. Exiting.");
//         process.exit(1);
//       }
//       console.log(`🔄 Retrying in ${delay / 1000}s... (${retries} attempts left)`);
//       await new Promise((res) => setTimeout(res, delay));
//     }
//   }
// };

// export { sequelize, connectWithRetry };


import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Use .env values with fallback defaults
export const sequelize = new Sequelize(
  process.env.DB_NAME || "erbdb",
  process.env.DB_USER || "erbadmin",
  process.env.DB_PASSWORD || "admin@NSE#256",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: false
    },
    logging: true
  }
);

// Retry logic
export const connectWithRetry = async (retries = 10, delay = 5000) => {
  while (retries) {
    try {
      console.log("🟢 Trying to connect to database...");
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully.");
      return true;
    } catch (err) {
      console.error(`❌ Database connection failed: ${err.message}`);
      retries -= 1;
      if (!retries) {
        console.error("🚨 Out of retries. Exiting.");
        process.exit(1);
      }
      console.log(`🔄 Retrying in ${delay / 1000}s... (${retries} attempts left)`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

