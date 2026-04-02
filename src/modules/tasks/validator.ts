import { z } from "zod";
import { TASK_STATUS } from "./const";

const statusEnum = z.enum([TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(4000).optional(),
  status: statusEnum.optional()
});

export const updateTaskStatusSchema = z.object({
  status: statusEnum
});
