import { Router, Response, Request } from "express";

const router = Router();

router.post("/login", (_req: Request, res: Response) => {
  res.json({ message: "login" });
});

router.post("/logout", (_req: Request, res: Response) => {
  res.json({ message: "logout" });
});

router.post("/forget", (_req: Request, res: Response) => {
  res.json({ message: "forgot" });
});

router.post("/reset/:id", (req: Request, res: Response) => {
  res.json({ message: "reset", id: req.params.id });
});

router.post("/register", (_req: Request, res: Response) => {
  res.json({ message: "register" });
});

export default router;
