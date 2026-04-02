import { CorsOptions } from "cors";
import { config } from "./env";

export const corsOptions: CorsOptions = {
  origin: config.app.corsOrigin === "*" ? true : config.app.corsOrigin,
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  credentials: false
};
