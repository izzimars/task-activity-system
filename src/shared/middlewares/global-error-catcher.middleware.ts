import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../../config/logger";
import { AppError } from "../errors";

export const globalErrorCatcher = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.flatten()
    });
    return;
  }

  if (error instanceof AppError) {
    logger.warn(error.message, { details: error.details });
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
    return;
  }

  logger.error("Unhandled error", { error: String(error) });
  res.status(500).json({ message: "Internal server error" });
};
