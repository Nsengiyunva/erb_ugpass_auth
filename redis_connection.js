import IORedis from 'ioredis';

const redconnection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // ⚡ Required by BullMQ
  enableReadyCheck: false,    // optional, improves startup
});

export default redconnection;
