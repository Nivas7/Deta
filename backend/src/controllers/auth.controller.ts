import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("jwt", (err, user, _info) => {
    if (err) {
      console.error(err);
      return res.status(402);
    }
    if (!user) {
      return res.status(402);
    }
    return next();
  })(req, res, next);
};
