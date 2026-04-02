import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const requestBodyValidator = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body);
    next();
  };
};
