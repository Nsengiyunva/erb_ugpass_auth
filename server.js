// import express from "express";
// import * as dotenv from 'dotenv'
// import router from './routes/index.js'
// import authRoutes from './routes/auth.js'
// import { sendStyledMail, sendEmailsInChunks } from "./mailer.js";
// import path from "path";

// import { sequelize, connectWithRetry } from "./config/db.js";

// import IORedis from 'ioredis'
// import bodyParser from "body-parser";
// import { Queue } from "bullmq";
// import client from 'prom-client'


// dotenv.config();

// const uploadDir = path.join(process.cwd(), "uploads");

// const app = express();

// app.use(express.json({ limit: "200mb" }));
// app.use(express.urlencoded({ extended: true, limit: "200mb" }));
// app.use(bodyParser.json())


// client.collectDefaultMetrics();

// const httpRequestCounter = new client.Counter({
//   name: 'http_requests_total',
//   help: 'Total number of HTTP requests',
//   labelNames: ['method', 'route', 'status_code'],
// });

// const redisConnection  =  new IORedis( {
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT
// } )

// const PORT = process.env.PORT || 8754;

// const startServer = async () => {
//   await connectWithRetry(); 

//   await sequelize.sync({ alter: true }); 

//     app.use(function (_, res, next) {

//       res.header("Access-Control-Allow-Origin", "*"); // or "*" if you must
//       res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
//       res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
//       res.header("Access-Control-Allow-Credentials", "true");
//       next();
//     });
//     app.use( express.json() )

//     // Count all HTTP requests except /api/metrics
//     app.use((req, res, next) => {
//       if (req.path === '/api/metrics') return next();

//       res.on('finish', () => {
//         let routeLabel = req.route?.path || req.path;
//         httpRequestCounter.labels(req.method, routeLabel, res.statusCode).inc();
//       });
//       next();
//     } );


//     app.get('/api/metrics', async (req, res) => {
//       res.set('Content-Type', client.register.contentType);
//       res.end(await client.register.metrics());
//     });


//     app.use("/auth/api", authRoutes )
//     app.use( "/api", router )

//     app.use("/uploads", express.static(uploadDir));

//     const emailQueue = new Queue( "email_queue", {
//       connection: redisConnection
//     } )
    
//     app.get("/email/send", async (_, res) => {

//       const htmlContent = `
//       <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
//         <div style="max-width: 600px; background: white; border-radius: 10px; padding: 20px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #007bff;">Hello, King Isaac 👋</h2>
//           <p style="font-size: 16px; color: #333;">
//             This is a <strong>styled email</strong> sent from your Node.js API.
//           </p>
//           <p style="font-size: 15px; color: #666;">
//             It supports full HTML and inline CSS — so you can design beautiful email templates.
//           </p>
//           <a href="https://www.erb.go.ug" 
//             style="display:inline-block; margin-top:20px; background-color:#007bff; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
//             Visit ERB Website
//           </a>
//           <p style="margin-top:30px; font-size:13px; color:#999;">© 2025 ERB Uganda</p>
//         </div>
//       </div>
//     `;

//       try {
//         // await sendMail("isaacnsengiyunva@gmail.com", "Hello!", "This is a test email please.");
//         await sendStyledMail("isaacnsengiyunva@gmail.com", "Email Test", htmlContent);
//         res.json({ message: "Email sent successfully!" });
//       } catch (err) {
//         // console.error( "failed to send email", err );
//         res.status(500).json({ error: "Failed to send email" });
//       }
//     });

//     app.post("/send-batch", async (req, res) => {
//       const { emails } = req.body;

//       const htmlContent = `
//       <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
//         <div style="max-width: 600px; background: white; border-radius: 10px; padding: 20px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
//           <h2 style="color: #007bff;">Hello, King Isaac 👋</h2>
//           <p style="font-size: 16px; color: #333;">
//             This is a <strong>styled email</strong> sent from your Node.js API.
//           </p>
//           <p style="font-size: 15px; color: #666;">
//             It supports full HTML and inline CSS — so you can design beautiful email templates.
//           </p>
//           <a href="https://www.erb.go.ug" 
//             style="display:inline-block; margin-top:20px; background-color:#007bff; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
//             Visit ERB Website
//           </a>
//           <p style="margin-top:30px; font-size:13px; color:#999;">© 2025 ERB Uganda</p>
//         </div>
//       </div>
//     `;

//       if (!emails || !Array.isArray(emails) || emails.length === 0) {
//         return res.status(400).json({ message: "Emails array is required" });
//       }

//       let subject = "RE: ERB TEST MAIL:";

//       try {
//         await sendEmailsInChunks(emails, subject, htmlContent, {
//           chunkSize: 50,
//           retryLimit: 3,
//           rateLimitPerSec: 5, // adjust as needed
//         });
//         // let subject = "RE: ERB TEST MAILS";
//         // await emailQueue.add( "batch_email", { emails, subject, htmlContent } )

//         res.status( 202 ).json( {
//           message: "Emails queued successfully",
//           count: emails.length
//         } )

//       } catch (err) {
//         res.status(500).json({ message: "Failed to send some emails", error: err.message });
//       }
//     });

//     app.listen(PORT, () => {
//       console.log(`The Server is running on port: ${PORT}`);
//     });
// };

// startServer();


// import express from "express";
// import dotenv from "dotenv";
// import engineers_routes  from "./routes/engineer_routes"



import express from "express";
import * as dotenv from 'dotenv'
import router from './routes/index.js'
import authRoutes from './routes/auth.js'
// import { sendStyledMail, sendEmailsInChunks } from "./mailer.js";
// import path from "path";
import { sequelize, connectDB } from "./config/db.js";
import IORedis from "ioredis";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8754;
   
app.use(express.json());

app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// const redis = new IORedis({
//   host: process.env.REDIS_HOST || "127.0.0.1",
//   port: process.env.REDIS_PORT || 6379,
//   password: process.env.REDIS_PASSWORD || undefined,
// });

  app.use( express.json() )

  app.use("/auth/api", authRoutes )
  app.use( "/api", router )

  const emailQueue = new Queue( "email_queue", {
    connection: redisConnection
  } )
    
  app.post("/email/send", async (req, res) => {
    const { name, email } = req.body

    const htmlContent = `
<div style="font-family: Arial, Helvetica, sans-serif; background-color: #f8f2f2; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background-color: #b30000; padding: 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px;">
        Engineers Registration Board (ERB)
      </h1>
    </div>

    <!-- Body -->
    <div style="padding: 25px; color: #333333;">
      <h2 style="color: #b30000; font-size: 20px;">
        Welcome, ${name} 👋
      </h2>

      <p style="font-size: 15px; line-height: 1.6;">
        Your account has been <strong>successfully registered</strong> with the
        <strong>Engineers Registration Board (ERB)</strong>.
      </p>

      <p style="font-size: 15px; line-height: 1.6;">
        You can now log in to the ERB portal using your registered email address
        and the password you provided during registration.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://registration.erb.go.ug"
          style="
            background-color: #b30000;
            color: #ffffff;
            padding: 12px 28px;
            font-size: 15px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
          ">
          Login to ERB Portal
        </a>
      </div>

      <p style="font-size: 14px; color: #555555;">
        If you did not initiate this registration, please contact ERB support immediately.
      </p>

      <p style="font-size: 14px; color: #555555;">
        For security reasons, do not share your password with anyone.
      </p>

      <p style="margin-top: 25px; font-size: 15px;">
        Kind regards,<br />
        <strong>ERB Support Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; color: #777777;">
      © 2025 Engineers Registration Board (ERB) Uganda<br />
      <a href="https://www.erb.go.ug" style="color: #b30000; text-decoration: none;">
        www.erb.go.ug
      </a>
    </div>

  </div>
</div>
  `;

    try {
      // await sendMail("isaacnsengiyunva@gmail.com", "Hello!", "This is a test email please.");
      await sendStyledMail( email, "RE:ENGINEERS REGISTRATION BOARD PLATFORM ACCOUNT REGISTRATION", htmlContent);
      res.json({ message: "Email sent successfully!" });
    } catch (err) {
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.post("/send-batch", async (req, res) => {
    const { emails } = req.body;

  const htmlContent = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; padding: 40px 20px;">
    <div style="max-width: 650px; background: white; border-radius: 12px; margin: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
      
      <!-- Header with red accent -->
      <div style="background: linear-gradient(135deg, #dc143c 0%, #8b0000 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Engineers Registration Board</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Uganda</p>
      </div>

      <!-- Main content -->
      <div style="padding: 40px 30px;">
        <h2 style="color: #dc143c; font-size: 24px; margin: 0 0 20px 0; border-bottom: 3px solid #dc143c; padding-bottom: 10px; display: inline-block;">
          Welcome to Our Digital Platform
        </h2>
        
        <p style="font-size: 16px; color: #333; line-height: 1.8; margin: 20px 0;">
          The Engineers Registration Board has upgraded to <strong>Digital application, registration and licensing system</strong> starting 2026. ERB has developed a bespoke E-Registration & Licencing and Information Management System to enhance effectiveness in its mandate to register, regulate and control engineering professional practice across the country.
        </p>

        <div style="background-color: #fff5f5; border-left: 4px solid #dc143c; padding: 20px; margin: 25px 0; border-radius: 4px;">
          <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0;">
            The system shall provide a convenient and efficient online service that reduces the application and processing time for obtaining the relevant licences in one single platform.
          </p>
        </div>

        <h3 style="color: #333; font-size: 20px; margin: 30px 0 15px 0;">What You Can Do:</h3>
        <ul style="color: #555; font-size: 15px; line-height: 1.9; padding-left: 20px;">
          <li>Make payments online</li>
          <li>Download your licence instantly</li>
          <li>Update your registration profile</li>
          <li>Sponsor new applicants for registration</li>
        </ul>

        <div style="background: linear-gradient(135deg, #dc143c 0%, #8b0000 100%); padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
          <p style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">
            🎉 Your 2026 Licence is Ready!
          </p>
          <p style="color: rgba(255,255,255,0.95); font-size: 15px; margin: 0;">
            Access and download your licence online now
          </p>
        </div>

        <h3 style="color: #333; font-size: 20px; margin: 30px 0 15px 0;">Getting Started:</h3>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 15px 0;">
          <p style="font-size: 15px; color: #333; margin: 0 0 10px 0; font-weight: 600;">
            ✓ Already have an account?
          </p>
          <p style="font-size: 15px; color: #555; margin: 0; line-height: 1.6;">
            Reset your password and log in using the link below.
          </p>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 15px 0;">
          <p style="font-size: 15px; color: #333; margin: 0 0 10px 0; font-weight: 600;">
            ✓ New to the system?
          </p>
          <p style="font-size: 15px; color: #555; margin: 0; line-height: 1.6;">
            Create your account to get started with the E-Registration system.
          </p>
        </div>

        <div style="text-align: center; margin: 35px 0;">
          <a href="https://registration.erb.go.ug" 
            style="display: inline-block; background: linear-gradient(135deg, #dc143c 0%, #8b0000 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3); transition: all 0.3s;">
            Access ERB E-System
          </a>
        </div>

        <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 25px 0;">
          For any inquiries, reach out to the ERB office for assistance.
        </p>

        <div style="background-color: #fff5f5; padding: 20px; border-radius: 6px; margin: 30px 0; text-align: center;">
          <p style="color: #dc143c; font-size: 17px; font-weight: 600; margin: 0 0 5px 0;">
            Thank you and welcome onboard the ERB E-System
          </p>
          <p style="color: #8b0000; font-size: 18px; font-weight: 700; margin: 10px 0 0 0;">
            🎊 Happy New Year 2026 🎊
          </p>
        </div>

        <div style="border-top: 2px solid #f0f0f0; margin-top: 40px; padding-top: 25px;">
          <p style="font-size: 15px; color: #333; margin: 0 0 5px 0; font-weight: 600;">
            REGISTRAR
          </p>
          <p style="font-size: 14px; color: #777; margin: 0;">
            26.12.2025
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #1a1a1a; padding: 25px 30px; text-align: center;">
        <p style="color: #999; font-size: 13px; margin: 0 0 8px 0;">
          © 2025 Engineers Registration Board, Uganda
        </p>
        <p style="color: #666; font-size: 12px; margin: 0;">
          This email was sent regarding your ERB registration and licensing
        </p>
      </div>

    </div>
  </div>
`;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: "Emails array is required" });
    }

    let subject = "RE: ERB TEST MAIL:";

    try {
      await sendEmailsInChunks(emails, subject, htmlContent, {
        chunkSize: 50,
        retryLimit: 3,
        rateLimitPerSec: 5, // adjust as needed
      });
      // let subject = "RE: ERB TEST MAILS";
      // await emailQueue.add( "batch_email", { emails, subject, htmlContent } )

      res.status( 202 ).json( {
        message: "Emails queued successfully",
        count: emails.length
      } )

    } catch (err) {
      res.status(500).json({ message: "Failed to send some emails", error: err.message });
    }
  });


connectDB();
sequelize.sync().then(() => console.log("ERB Tables synced..."));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
