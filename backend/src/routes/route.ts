import { Express, Request, Response } from "express";
import {
  logInController,
  registerController,
} from "../controllers/auth.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import registerSchema from "../types/registerSchema.js";
import loginSchema from "../types/loginSchema.js";

function routes(app: Express): void {
  app.get("/", (_: Request, res: Response) => {
    res.status(200).send("Ping from Server");
  });
  app.post("/register", validateRequest(registerSchema), registerController);

  app.post("/login", validateRequest(loginSchema), logInController);
}

export default routes;
