import { NextFunction, Request, RequestHandler, Response } from "express";
import { ObjectSchema } from "yup";
import { LoginSchema } from "../types/loginSchema.js";
import { RegisterSchema } from "../types/registerSchema.js";

type SchemaType = RegisterSchema | LoginSchema;

const validateRequest = (schema: ObjectSchema<SchemaType>): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedReqBody = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.body = validatedReqBody;
      next();
    } catch (error: any) {
      res.status(400).json(error.message);
    }
  };
};

export default validateRequest;
