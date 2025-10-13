import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "relay.umcs.go.ug",
    port: 587,
    secure: false, // use TLS if port 465
    auth: {
      user: "licenses@erb.go.ug",
      pass: "081IZCno7sEghbh2LwbfGVtB",
    },
    tls: {
      rejectUnauthorized: false, // disable cert verification if necessary
    },
  });


  export async function sendMail(to, subject, text) {
    const info = await transporter.sendMail({
      from: "licenses@erb.go.ug",
      to,
      subject,
      text,
    });
  
    console.log("Mail sent:", info.messageId);
  }