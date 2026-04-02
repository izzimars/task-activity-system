import { Router } from "express";
import { createTask, listTasks, updateTaskStatus } from "./controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { requestBodyValidator } from "../../shared/middlewares/request-body-validator.middleware";
import { createTaskSchema, updateTaskStatusSchema } from "./validator";

const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.get("/", listTasks);
taskRouter.post("/", requestBodyValidator(createTaskSchema), createTask);
taskRouter.patch("/:id", requestBodyValidator(updateTaskStatusSchema), updateTaskStatus);

export default taskRouter;
