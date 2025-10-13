import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import router from './routes/index.js'
import authRoutes from './routes/auth.js'
import sequelize from './config/db.js';
import { sendMail } from "./mailer.js";
dotenv.config()

// global.__basedir = __dirname;
const app = express()

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));


//connect to the db
sequelize.sync( { alter: true  })
.then( () => console.log("Mysql database connected.") )
.catch( ( err ) => console.error("Database connection error", err ) );

const port = 8753

app.options('*', cors());
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
  try {
    await sendMail("isaacnsengiyunva@gmail.com", "Hello!", "This is a test email please.");
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error( "failed to send email", err );
    res.status(500).json({ error: "Failed to send email" });
  }
});


app.listen( port, () => {
    console.log( `Server is listening on port ${port}` )
} )
