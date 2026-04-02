import { getEnv, getEnvNumber } from "../../shared/utils/env";

export const getProductionConfig = () => ({
  app: {
    nodeEnv: "production",
    port: getEnvNumber("PROD_PORT", 3000),
    corsOrigin: getEnv("PROD_CORS_ORIGIN", "*"),
    jwtSecret: getEnv("PROD_JWT_SECRET")
  },
  postgres: {
    host: getEnv("PROD_POSTGRES_HOST"),
    port: getEnvNumber("PROD_POSTGRES_PORT", 5432),
    user: getEnv("PROD_POSTGRES_USER"),
    password: getEnv("PROD_POSTGRES_PASSWORD"),
    database: getEnv("PROD_POSTGRES_DB")
  },
  redis: {
    host: getEnv("PROD_REDIS_HOST"),
    port: getEnvNumber("PROD_REDIS_PORT", 6379),
    password: getEnv("PROD_REDIS_PASSWORD", "") || undefined
  }
});
