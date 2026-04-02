import cors from "cors";
import express from "express";
import { corsOptions } from "./cors";
import rootRouter from "../routes";
import { requestLogger } from "../shared/middlewares/request-logger.middleware";
import { responseLogger } from "../shared/middlewares/response-logger.middleware";
import { globalErrorCatcher } from "../shared/middlewares/global-error-catcher.middleware";

export const createExpressApp = () => {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(requestLogger);
  app.use(responseLogger);

  app.use(rootRouter);

  app.use(globalErrorCatcher);

  return app;
};
