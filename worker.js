import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// --- Mail transporter ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- Helper ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sendWithRetry(email, subject, html, retries = 3) {
  for (let i = 1; i <= retries; i++) {
    try {
      await transporter.sendMail({
        from: `"My Company" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html,
      });
    //   console.log(`✅ Sent: ${email}`);
      return;
    } catch (err) {
    //   console.error(`❌ Error sending to ${email} (Attempt ${i}): ${err.message}`);
      if (i === retries) throw err;
      await sleep(2000);
    }
  }
}

async function sendEmailsInChunks(emails, subject, html) {
  const chunkSize = 50;
  const rateLimitPerSec = 5;
  const delay = 1000 / rateLimitPerSec;

  for (let i = 0; i < emails.length; i += chunkSize) {
    const chunk = emails.slice(i, i + chunkSize);
    console.log(`📦 Sending chunk ${i / chunkSize + 1} (${chunk.length} emails)`);

    for (const email of chunk) {
      await sendWithRetry(email, subject, html);
      await sleep(delay);
    }

    console.log(`✅ Chunk ${i / chunkSize + 1} complete`);
    await sleep(3000);
  }
}

// --- Worker process ---
new Worker(
  "email_queue",
  async (job) => {
    const { emails, subject, htmlContent } = job.data;
    console.log(`📧 Processing ${emails.length} emails...`);
    await sendEmailsInChunks(emails, subject, htmlContent);
    console.log(`✅ All ${emails.length} emails sent successfully`);
  },
  { connection: redisConnection }
);
