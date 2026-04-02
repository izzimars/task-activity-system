import { Router } from "express";
import { login, register } from "./controller";
import { requestBodyValidator } from "../../shared/middlewares/request-body-validator.middleware";
import { loginSchema, registerSchema } from "./validator";

const authRouter = Router();

authRouter.post("/register", requestBodyValidator(registerSchema), register);
authRouter.post("/login", requestBodyValidator(loginSchema), login);

export default authRouter;
