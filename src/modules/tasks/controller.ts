import { NextFunction, Response } from "express";
import { AppError } from "../../shared/errors";
import { RequestWithUser } from "../../shared/types";
import { TaskService } from "./services";
import { logger } from "../../config/logger";

const taskService = new TaskService();

export const createTask = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      logger.warn("Unauthorized access attempt to create task");
      throw new AppError("Unauthorized", 401);
    }

    const task = await taskService.createTask({
      ...req.body,
      created_by: req.user.id
    });

    logger.info("Task created successfully", { taskId: task.id });
    res.status(201).json(task);
  } catch (error) {
    logger.error("Error occurred while creating task", { error });
    next(error);
  }
};

export const updateTaskStatus = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new AppError("Unauthorized", 401);
    }

    const task = await taskService.updateTaskStatus(req.params.id, req.user.id, req.body);
    logger.info("Task status updated successfully", { taskId: task.id });
    res.status(200).json(task);
  } catch (error) {
    logger.error("Error occurred while updating task status", { error });
    next(error);
  }
};

export const listTasks = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new AppError("Unauthorized", 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;

    const result = await taskService.listTasks(req.user.id, page, limit, status);
    res.status(200).json(result);
  } catch (error) {
    logger.error("Error occurred while listing tasks", { error });
    next(error);
  }
};
