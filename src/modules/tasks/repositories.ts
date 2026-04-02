import { db } from "../../config/database";
import { AppError } from "../../shared/errors";
import { CreateTaskDto, UpdateTaskStatusDto } from "./dto";
import { TaskEntity } from "./entities";
import { taskQueries } from "./queries";

export class TaskRepository {
  async create(payload: CreateTaskDto): Promise<TaskEntity> {
    const values = [payload.title, payload.description ?? "", payload.status ?? "todo", payload.created_by];
    const result = await db.query<TaskEntity>(taskQueries.create, values);
    return result.rows[0];
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const result = await db.query<TaskEntity>(taskQueries.findById, [id]);
    return result.rows[0] ?? null;
  }

  async updateStatus(id: string, payload: UpdateTaskStatusDto): Promise<TaskEntity> {
    const values = [id, payload.status];
    const result = await db.query<TaskEntity>(taskQueries.updateStatus, values);

    if (!result.rows[0]) {
      throw new AppError("Task not found", 404);
    }

    return result.rows[0];
  }

  async list(
  createdBy: string,
  page: number = 1,
  limit: number = 10,
  status?: string
): Promise<{ tasks: TaskEntity[]; total: number }> {
  const offset = (page - 1) * limit;

  let tasks, count;

  if (status) {
    [tasks, count] = await Promise.all([
      db.query<TaskEntity>(taskQueries.listByStatus, [createdBy, status, limit, offset]),
      db.query<{ total: string }>(taskQueries.countByStatus, [createdBy, status])
    ]);
  } else {
    [tasks, count] = await Promise.all([
      db.query<TaskEntity>(taskQueries.list, [createdBy, limit, offset]),
      db.query<{ total: string }>(taskQueries.count, [createdBy])
    ]);
  }

  return {
    tasks: tasks.rows,
    total: parseInt(count.rows[0].total)
  };
}
}
