import express from 'express'
import cors from 'cors'
// require( "dotenv" ).config
import * as dotenv from 'dotenv'
dotenv.config()

import router from './routes/index.js'

// global.__basedir = __dirname;

const app = express()

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));

const port = 8752

app.options('*', cors());
app.use(function (req, res, next) {

  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});
app.use( express.json() )


app.use( "/api", router )

app.listen( port, () => {
    console.log( `Server is listening on port ${port}` )
} )
