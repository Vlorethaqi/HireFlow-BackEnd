import { createClient } from "redis";

const DEFAULT_TTL_SECONDS = 300;

let client;
let connectionPromise;
let isDisabled = false;

function getClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      socket: {
        reconnectStrategy: false,
      },
    });

    client.on("error", (error) => {
      isDisabled = true;
      console.warn(`Redis cache disabled: ${error.message}`);
    });

    client.on("connect", () => {
      isDisabled = false;
      console.log("Redis cache connected");
    });
  }

  return client;
}

async function connect() {
  if (isDisabled) {
    return null;
  }

  const redisClient = getClient();

  if (redisClient.isOpen) {
    return redisClient;
  }

  connectionPromise = connectionPromise || redisClient.connect().catch((error) => {
    isDisabled = true;
    console.warn(`Redis cache unavailable: ${error.message}`);
    return null;
  });

  return connectionPromise;
}

export async function getCache(key) {
  const redisClient = await connect();

  if (!redisClient) {
    return null;
  }

  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
}

export async function setCache(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
  const redisClient = await connect();

  if (!redisClient) {
    return;
  }

  await redisClient.set(key, JSON.stringify(value), {
    EX: ttlSeconds,
  });
}

export async function deleteCache(keys) {
  const redisClient = await connect();

  if (!redisClient) {
    return;
  }

  const keyList = Array.isArray(keys) ? keys : [keys];

  if (keyList.length > 0) {
    await redisClient.del(keyList);
  }
}

export async function deleteCachePattern(pattern) {
  const redisClient = await connect();

  if (!redisClient) {
    return;
  }

  for await (const key of redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })) {
    await redisClient.del(key);
  }
}

export function cacheKeys() {
  return {
    company: (companyId) => `company:${companyId}`,
    users: (companyId) => `users:company:${companyId}`,
    permission: (companyId, roleName, permissionName) =>
      `permission:${companyId}:${roleName}:${permissionName}`,
    jobsQuery: (query = {}) => `jobs:query:${Buffer.from(JSON.stringify(query)).toString("base64url")}`,
  };
}
