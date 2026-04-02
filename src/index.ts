import http from "http";
import { config } from "./config/env";
import { createExpressApp } from "./config/express";
import { connectDatabase } from "./config/database";
import { logger } from "./config/logger";
import { initializeWebSocketServer } from "./websocket/server";

const bootstrap = async (app = createExpressApp()): Promise<void> => {
  await connectDatabase();

  const server = http.createServer(app);

  await initializeWebSocketServer(server);

  server.listen(config.app.port, () => {
    logger.info("Server started", {
      port: config.app.port,
      env: config.app.nodeEnv
    });
  });
};

bootstrap().catch((error: unknown) => {
  logger.error("Application failed to start", { error: String(error) });
  process.exit(1);
});
