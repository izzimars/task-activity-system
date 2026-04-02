import { Router } from "express";
import authRouter from "../../modules/auth/routes";
import taskRouter from "../../modules/tasks/routes";

const v1Router = Router();

v1Router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

v1Router.use("/auth", authRouter);
v1Router.use("/tasks", taskRouter);

export default v1Router;
