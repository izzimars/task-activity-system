import { NextFunction, Request, Response } from "express";
import { logger } from "../../config/logger";

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip
  });
  next();
};
