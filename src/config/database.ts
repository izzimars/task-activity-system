import { Pool } from "pg";
import { config } from "./env";
import { logger } from "./logger";

export const db = new Pool({
  host: config.postgres.host,
  port: config.postgres.port,
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database
});

export const connectDatabase = async (): Promise<void> => {
  await db.query("SELECT 1");
  logger.info("PostgreSQL connected");
};
