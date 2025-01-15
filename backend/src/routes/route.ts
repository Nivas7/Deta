import type { Express, Request, Response } from "express";

import {
  logInController,
  registerController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

function routes(app: Express): void {
  app.get("/", (_: Request, res: Response) => {
    res.status(200).send("Ping from Server");
  });

  app.post("/register",  registerController);

  app.post("/login",  logInController);

  app.post("/expenses", authMiddleware, (req: Request, res: Response) => {

    const user = req.user
    res.status(200).send(`Expenses for ${user?.name}`);
  });
}

export default routes;
