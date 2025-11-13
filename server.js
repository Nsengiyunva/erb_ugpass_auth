// import express from "express";
// import * as dotenv from 'dotenv'
// import router from './routes/index.js'
// import authRoutes from './routes/auth.js'
// import { sendStyledMail } from "./mailer.js";

// import { sequelize, connectWithRetry } from "./config/db.js";

// import IORedis from 'ioredis'
// import bodyParser from "body-parser";
// import { Queue } from "bullmq";
// import client from 'prom-client'


// dotenv.config()
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
//         // Use req.route.path if available, otherwise fallback to req.path
//         let routeLabel = req.route?.path || req.path;
//         httpRequestCounter.labels(req.method, routeLabel, res.statusCode).inc();
//       });

//       next();
//     });


//     app.get('/api/metrics', async (req, res) => {
//       res.set('Content-Type', client.register.contentType);
//       res.end(await client.register.metrics());
//     });


//     app.use("/auth/api", authRoutes )
//     app.use( "/api", router )

//     const emailQueue = new Queue( "email_queue", {
//       connection: redisConnection
//     } )
    

//     //send email notification
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
//         console.error( "failed to send email", err );
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

//       try {
//         // await sendEmailsInChunks(emails, subject, htmlContent, {
//         //   chunkSize: 50,
//         //   retryLimit: 3,
//         //   rateLimitPerSec: 5, // adjust as needed
//         // });
//         await emailQueue.add( "batch_email", { emails, subject, htmlContent } )

//         res.status( 202 ).json( {
//           message: "Emails queued successfully",
//           count: emails.length
//         } )

//       } catch (err) {
//         res.status(500).json({ message: "Failed to send some emails", error: err.message });
//       }
//     });

//     app.listen(PORT, () => {
//       console.log(`The Server is running on port=${PORT}`);
//     });
// };

// startServer();


import express from 'express'
import http from 'http';
import { Server } from 'socket.io';
import jobQueue from './queue.js';
import { QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // change this to your React app domain
  },
});

app.use(express.json());

// Add new job
app.post('/api/start-job', async (req, res) => {
  const job = await jobQueue.add('processData', { user: req.body.userId });
  res.json({ jobId: job.id });
});

// Real-time notification setup
const queueEvents = new QueueEvents('background-jobs', { connection: new Redis() });

queueEvents.on('completed', ({ jobId }) => {
  console.log(`Job ${jobId} completed — notifying clients`);
  io.emit('job-completed', { jobId, message: `Job ${jobId} completed successfully` });
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  io.emit('job-failed', { jobId, message: failedReason });
});

server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
