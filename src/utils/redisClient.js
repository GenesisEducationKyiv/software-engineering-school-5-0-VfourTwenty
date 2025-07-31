const redis = require('redis');

const client = redis.createClient(); // defaults to localhost:6379

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await client.connect();
})();

module.exports = client;
