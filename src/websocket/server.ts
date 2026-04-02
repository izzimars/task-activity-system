import { Server as HttpServer } from "http";
import { WebSocketServer } from "ws";
import { logger } from "../config/logger";
import { TASK_UPDATED_CHANNEL } from "../modules/tasks/const";
import { redisService } from "../shared/services/redis/redis";

export const initializeWebSocketServer = async (httpServer: HttpServer): Promise<void> => {
  const wsServer = new WebSocketServer({ server: httpServer, path: "/ws" });

  wsServer.on("connection", (socket) => {
    logger.info("WebSocket client connected", { clients: wsServer.clients.size });

    socket.send(
      JSON.stringify({
        event: "connection:ready",
        message: "Connected to real-time updates"
      })
    );

    socket.on("close", () => {
      logger.info("WebSocket client disconnected", { clients: wsServer.clients.size });
    });
  });

  await redisService.subscriber.subscribe(TASK_UPDATED_CHANNEL);

  redisService.subscriber.on("message", (channel, message) => {
    if (channel !== TASK_UPDATED_CHANNEL) {
      return;
    }

    for (const client of wsServer.clients) {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    }
  });

  logger.info("WebSocket server initialized", { path: "/ws", channel: TASK_UPDATED_CHANNEL });
};
