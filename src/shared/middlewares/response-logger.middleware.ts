import { NextFunction, Request, Response } from "express";
import { logger } from "../../config/logger";

export const responseLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startedAt = Date.now();

  res.on("finish", () => {
    logger.info("Outgoing response", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt
    });
  });

  next();
};
