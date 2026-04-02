import dotenv from "dotenv";
import { getDevelopmentConfig } from "./development";
import { getProductionConfig } from "./production";
import { getTestConfig } from "./test";

dotenv.config();

const env = process.env.NODE_ENV ?? "development";

export const config = env === "production" ? getProductionConfig() : env === "test" ? getTestConfig() : getDevelopmentConfig();

export const JwtSignOptions = {
  issuer: "task-system",
  subject: "Authentication Token",
  audience: "http://localhost:3000"
};
