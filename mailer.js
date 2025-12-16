import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
});

  // --- Helper: Delay utility ---
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));


  export async function sendMail(to, subject, text) {
    const info = await transporter.sendMail({
      from: `"Use" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
  
    console.log("Mail sent:", info.messageId);
  }


  export async function sendStyledMail(to, subject, htmlContent) {
    const info = await transporter.sendMail({
      from: `"ERB Notifications" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
  
    console.log("Mail sent:", info.messageId);
  }

  export async function sendEmailsInChunks(emails, subject, htmlContent, {
    chunkSize = 50,
    retryLimit = 3,
    rateLimitPerSec = 5,
  } = {}) {
    const delayBetweenEmails = 1000 / rateLimitPerSec;
  
    for (let i = 0; i < emails.length; i += chunkSize) {
      const chunk = emails.slice(i, i + chunkSize);
      console.log(`📦 Sending chunk ${i / chunkSize + 1} (${chunk.length} emails)`);
  
      for (const email of chunk) {
        await sendWithRetry(email, subject, htmlContent, retryLimit);
        await sleep(delayBetweenEmails); 
      }
  
      console.log(`✅ Finished chunk ${i / chunkSize + 1}`);
      await sleep(3000); 
    }
  }

  export async function sendWithRetry(email, subject, htmlContent, retries) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await transporter.sendMail({
          from: `"ERB Notifications" <${process.env.SMTP_USER}>`,
          to: email,
          subject,
          html: htmlContent,
        });
        console.log(`✅ Sent to ${email}`);
        return;
      } catch (err) {
        console.error(`❌ Failed to send to ${email}, attempt ${attempt}: ${err.message}`);
        if (attempt === retries) throw err;
        await sleep(2000); // wait before retry
      }
    }
  }

  