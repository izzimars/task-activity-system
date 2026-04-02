import { getEnv, getEnvNumber } from "../../shared/utils/env";

export const getDevelopmentConfig = () => ({
  app: {
    nodeEnv: "development",
    port: getEnvNumber("DEV_PORT", 3000),
    corsOrigin: getEnv("DEV_CORS_ORIGIN", "*"),
    jwtSecret: getEnv("DEV_JWT_SECRET", "dev-secret")
  },
  postgres: {
    host: getEnv("DEV_POSTGRES_HOST", "localhost"),
    port: getEnvNumber("DEV_POSTGRES_PORT", 5432),
    user: getEnv("DEV_POSTGRES_USER", "postgres"),
    password: getEnv("DEV_POSTGRES_PASSWORD", "postgres"),
    database: getEnv("DEV_POSTGRES_DB", "taskdb")
  },
  redis: {
    host: getEnv("DEV_REDIS_HOST", "localhost"),
    port: getEnvNumber("DEV_REDIS_PORT", 6379),
    password: getEnv("DEV_REDIS_PASSWORD", "") || undefined
  }
});
