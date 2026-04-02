import { NextFunction, Request, Response } from "express";
import { AuthService } from "./services";
import { logger } from "../../config/logger";

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    logger.info("User registered successfully", { userId: result.id });
    res.status(201).json(result);
  } catch (error) {
    logger.error("Error occurred while registering user", { error });
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    logger.info("User logged in successfully", { userId: result.id });
    res.status(200).json(result);
  } catch (error) {
    logger.error("Error occurred while logging in user", { error });
    next(error);
  }
};
