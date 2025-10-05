import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'

import sequelize from './config/db';
import router from './routes/index.js'
import authRoutes from './middleware/auth_middleware.js'
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


app.listen( port, () => {
    console.log( `Server is listening on port ${port}` )
} )
