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
      return res.status(401);
    }
    if (!user) {
      return res.status(401);
    }
    return next();
  })(req, res, next);
};

export const authorizeJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("jwt", function (err, user, jwtToken) {
    if (err) {
      console.log(err);
      return res.status(401);
    }
    if (!user) {
      return res.status(401);
    } else {
      const scope = req.baseUrl.split("/").slice(-1)[0];
      const authScope = jwtToken.scope;

      if (authScope && authScope.indexOf(scope) > -1) {
        return next();
      } else {
        return res.status(401);
      }
    }
  })(req, res, next);
};
