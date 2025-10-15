// import express from 'express'
// import cors from 'cors'
// import * as dotenv from 'dotenv'
// import router from './routes/index.js'
// import authRoutes from './routes/auth.js'
// import sequelize from './config/db.js';
// // import { sendMail } from "./mailer.js";
// import { sendStyledMail } from "./mailer.js";
// dotenv.config()

// // global.__basedir = __dirname;
// const app = express()

// app.use(express.json({ limit: "200mb" }));
// app.use(express.urlencoded({ extended: true, limit: "200mb" }));


// //connect to the db
// sequelize.sync( { alter: true  })
// .then( () => console.log("Mysql Database connected.") )
// .catch( ( err ) => console.error("Database connection error", err ) );

// const port = 8754

// app.options('*', cors());
// app.use(function (req, res, next) {

//   res.header('Access-Control-Allow-Origin', "*");
//   res.header('Access-Control-Allow-Headers', true);
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   next();
// });
// app.use( express.json() )

// app.use("/auth/api", authRoutes )
// app.use( "/api", router )

// //send email notification
// app.get("/email/send", async (_, res) => {

//   const htmlContent = `
//   <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
//     <div style="max-width: 600px; background: white; border-radius: 10px; padding: 20px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
//       <h2 style="color: #007bff;">Hello, King Isaac 👋</h2>
//       <p style="font-size: 16px; color: #333;">
//         This is a <strong>styled email</strong> sent from your Node.js API.
//       </p>
//       <p style="font-size: 15px; color: #666;">
//         It supports full HTML and inline CSS — so you can design beautiful email templates.
//       </p>
//       <a href="https://www.erb.go.ug" 
//          style="display:inline-block; margin-top:20px; background-color:#007bff; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
//          Visit ERB Website
//       </a>
//       <p style="margin-top:30px; font-size:13px; color:#999;">© 2025 ERB Uganda</p>
//     </div>
//   </div>
// `;

//   try {
//     // await sendMail("isaacnsengiyunva@gmail.com", "Hello!", "This is a test email please.");
//     await sendStyledMail("isaacnsengiyunva@gmail.com", "Email Test", htmlContent);
//     res.json({ message: "Email sent successfully!" });
//   } catch (err) {
//     console.error( "failed to send email", err );
//     res.status(500).json({ error: "Failed to send email" });
//   }
// });

// app.post("/send-batch", async (req, res) => {
//   const { emails, subject, htmlContent } = req.body;

//   if (!emails || !Array.isArray(emails) || emails.length === 0) {
//     return res.status(400).json({ message: "Emails array is required" });
//   }

//   try {
//     await sendEmailsInChunks(emails, subject, htmlContent, {
//       chunkSize: 50,
//       retryLimit: 3,
//       rateLimitPerSec: 5, // adjust as needed
//     });

//     res.status(200).json({ message: "All emails sent successfully!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to send some emails", error: err.message });
//   }
// });


// app.listen( port, () => {
//     console.log( `Server is listening on port ${port}` )
// } )
import express from "express";
import * as dotenv from 'dotenv'
import router from './routes/index.js'
import authRoutes from './routes/auth.js'
// import sequelize from './config/db.js';
// import { sendMail } from "./mailer.js";
import { sendStyledMail } from "./mailer.js";
dotenv.config()
import { connectWithRetry } from "./config/db.js";

const app = express();

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
const PORT = process.env.PORT || 8754;

const startServer = async () => {
  await connectWithRetry(); // waits until DB is ready

    app.use(function (req, res, next) {

      res.header('Access-Control-Allow-Origin', "*");
      res.header('Access-Control-Allow-Headers', true);
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      next();
    });
    app.use( express.json() )

    app.use("/auth/api", authRoutes )
    app.use( "/api", router )

    //send email notification
    app.get("/email/send", async (_, res) => {

      const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
        <div style="max-width: 600px; background: white; border-radius: 10px; padding: 20px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #007bff;">Hello, King Isaac 👋</h2>
          <p style="font-size: 16px; color: #333;">
            This is a <strong>styled email</strong> sent from your Node.js API.
          </p>
          <p style="font-size: 15px; color: #666;">
            It supports full HTML and inline CSS — so you can design beautiful email templates.
          </p>
          <a href="https://www.erb.go.ug" 
            style="display:inline-block; margin-top:20px; background-color:#007bff; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
            Visit ERB Website
          </a>
          <p style="margin-top:30px; font-size:13px; color:#999;">© 2025 ERB Uganda</p>
        </div>
      </div>
    `;

      try {
        // await sendMail("isaacnsengiyunva@gmail.com", "Hello!", "This is a test email please.");
        await sendStyledMail("isaacnsengiyunva@gmail.com", "Email Test", htmlContent);
        res.json({ message: "Email sent successfully!" });
      } catch (err) {
        console.error( "failed to send email", err );
        res.status(500).json({ error: "Failed to send email" });
      }
    });

    app.post("/send-batch", async (req, res) => {
      const { emails, subject, htmlContent } = req.body;

      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ message: "Emails array is required" });
      }

      try {
        await sendEmailsInChunks(emails, subject, htmlContent, {
          chunkSize: 50,
          retryLimit: 3,
          rateLimitPerSec: 5, // adjust as needed
        });

        res.status(200).json({ message: "All emails sent successfully!" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send some emails", error: err.message });
      }
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port=: ${PORT}`);
    });
};

startServer();
