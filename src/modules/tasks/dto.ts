import { TaskStatus } from "./const";

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus,
  created_by: string;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
}
