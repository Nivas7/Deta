import { Request, Response } from "express";
import { createUser, logInUser } from "../services/user.service.js";

export async function logInController(req: Request, res: Response) {
  const userCredentials = req.body;
  const response = await logInUser(userCredentials);

  if (response.success == true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function registerController(req: Request, res: Response) {
  const userData = req.body;
  const response = await createUser(userData);

  if (response.success == true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}
