import { getEnv, getEnvNumber } from "../../shared/utils/env";

export const getTestConfig = () => ({
  app: {
    nodeEnv: "test",
    port: getEnvNumber("TEST_PORT", 3000),
    corsOrigin: getEnv("TEST_CORS_ORIGIN", "*"),
    jwtSecret: getEnv("TEST_JWT_SECRET", "test-secret")
  },
  postgres: {
    host: getEnv("TEST_POSTGRES_HOST", "localhost"),
    port: getEnvNumber("TEST_POSTGRES_PORT", 5432),
    user: getEnv("TEST_POSTGRES_USER", "postgres"),
    password: getEnv("TEST_POSTGRES_PASSWORD", "postgres"),
    database: getEnv("TEST_POSTGRES_DB", "taskdb")
  },
  redis: {
    host: getEnv("TEST_REDIS_HOST", "localhost"),
    port: getEnvNumber("TEST_REDIS_PORT", 6379),
    password: getEnv("TEST_REDIS_PASSWORD", "") || undefined
  }
});
