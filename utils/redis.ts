import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected');
});

export default redis;
