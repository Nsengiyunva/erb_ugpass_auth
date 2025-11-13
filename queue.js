import { Queue } from "bullmq";
import IORedis from "ioredis";
import redconnection from './redis_connection.js';

const jobQueue =  new Queue( "background-jobs", {
    redconnection
} )

export default jobQueue