import { Request, Response } from "express";
import { createUser, logInUser } from "../services/user.service.js";

async function logInController(req: Request, res: Response): Promise<void> {
  const userCredentials = req.body;
  const response = await logInUser(userCredentials);

  if (response.success === true) {
    res.status(response.status).json(response);
    return;
  }

  res.status(response.status).json(response);
}

async function registerController(req: Request, res: Response): Promise<void> {
  const userData = req.body;
  const response = await createUser(userData);

  if (response.success === true) {
    res.status(response.status).json(response);
    return;
  }

  res.status(response.status).json(response);
}

export { logInController, registerController };
