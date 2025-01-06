import { Router, Response, Request } from "express";
import {
  authenticateUser,
  registerUser,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/login", authenticateUser);

router.post("/logout", (_req: Request, res: Response) => {
  res.json({ message: "logout" });
});

router.post("/forget", (_req: Request, res: Response) => {
  res.json({ message: "forgot" });
});

router.post("/reset/:id", (req: Request, res: Response) => {
  res.json({ message: "reset", id: req.params.id });
});

router.post("/register", registerUser);

export default router;
