import "../configs/passport.js";
import { Request, Response } from "express";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/secrets.js";
import bcrypt from "bcryptjs";
import passport from "passport";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const hashedPassword = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10),
  );

  await User.create({
    username: req.body.username,
    password: hashedPassword,
  });

  const token = jwt.sign({ username: req.body.username }, JWT_SECRET);
  res.status(200).json({ token });
};

export const authenticateUser = (
  _req: Request,
  res: Response,
  next: Function,
) => {
  passport.authenticate("local", (err, user, _info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      const token = jwt.sign({ username: user.username }, JWT_SECRET);
      return res.status(200).send({ token });
    }
  });
};
