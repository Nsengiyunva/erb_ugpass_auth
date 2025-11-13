import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection  =  new IORedis( {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
} )

const jobQueue =  new Queue( "background-jobs", {
    connection
} )

export default jobQueue