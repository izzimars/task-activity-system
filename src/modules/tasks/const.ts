export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done"
} as const;

export const TASK_UPDATED_CHANNEL = "task:updated";

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
