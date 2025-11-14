import { Queue } from "bullmq";
import redconnection from './redis_connection.js';

const jobQueue =  new Queue( "background-jobs", {
    connection: redconnection
} )

export default jobQueue