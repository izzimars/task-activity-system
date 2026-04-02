import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/env";
import { AppError } from "../errors";
import { RequestWithUser } from "../types";

export const authMiddleware = (req: RequestWithUser, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, config.app.jwtSecret) as { userId: string; email: string };
    req.user = {
      id: payload.userId,
      email: payload.email
    };
    next();
  } catch (_error) {
    return next(new AppError("Unauthorized", 401));
  }
};
