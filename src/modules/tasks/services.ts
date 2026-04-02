import { redisService } from "../../shared/services/redis/redis";
import { AppError } from "../../shared/errors";
import { CreateTaskDto, UpdateTaskStatusDto } from "./dto";
import { TaskEntity } from "./entities";
import { TaskRepository } from "./repositories";
import { TASK_UPDATED_CHANNEL } from "./const";
import { logger } from "../../config/logger";

export class TaskService {
  private readonly taskRepository = new TaskRepository();

  async createTask(payload: CreateTaskDto): Promise<TaskEntity> {
    const task = await this.taskRepository.create(payload);
    await redisService.publish(TASK_UPDATED_CHANNEL, {
      event: TASK_UPDATED_CHANNEL,
      action: "created",
      data: task
    });
    logger.info("TaskService: Task created successfully", { taskId: task.id });

    return task;
  }

  async updateTaskStatus(id: string, currentUserId: string, payload: UpdateTaskStatusDto): Promise<TaskEntity> {
    const existingTask = await this.taskRepository.findById(id);

    if (!existingTask) {
      throw new AppError("Task not found", 404);
    }

    if (existingTask.created_by !== currentUserId) {
      throw new AppError("You are not authorized to update this task", 403);
    }

    const task = await this.taskRepository.updateStatus(id, payload);
    await redisService.publish(TASK_UPDATED_CHANNEL, {
      event: TASK_UPDATED_CHANNEL,
      action: "updated",
      data: task
    });
    logger.info("TaskService: Task status updated successfully", { taskId: task.id });
    return task;
  }

  async listTasks(
    currentUserId: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{ tasks: TaskEntity[]; total: number; page: number; limit: number }> {
    const result = await this.taskRepository.list(currentUserId, page, limit, status);
    logger.info("TaskService: Tasks listed successfully", { total: result.total, page, limit });
    return {
      ...result,
      page,
      limit
    };
  }
}
