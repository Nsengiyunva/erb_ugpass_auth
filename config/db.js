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

export const sequelize = new Sequelize(
  "erbdb",
  "erbadmin",
  "admin@NSE#256",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false, // disable SQL logs in production
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      freezeTableName: true, // prevent pluralization
      underscored: true,     // use snake_case columns
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ ERB Ugpass AuthDB Database connected");
  } catch (error) {
    console.error("❌ Unable to connect to ERB Database:", error);
    process.exit(1);
  }
};

