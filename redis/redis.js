const Redis = require("ioredis");
const redisAddress = process.env.REDIS_ADDRESS || "redis://127.0.0.1:6379";
const io = require("../io");

const redis = new Redis(redisAddress);
const redisSubscribers = {};

function addRedisSubscriber(subscriberKey) {
  const client = new Redis(redisAddress);

  client.subscribe(subscriberKey);
  client.on("message", function (channel, message) {
    io.emit(subscriberKey, JSON.parse(message));
  });

  redisSubscribers[subscriberKey] = client;
}

module.exports = { redis, addRedisSubscriber };
