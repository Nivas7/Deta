import jwt from "jsonwebtoken";
import { Response } from "express";
import { DbUser } from "../types/userType.js";
import User from "../models/User.js";

export type RefreshTokenData = {
  userId: string;
  refreshTokenVersion?: number;
};

export type AccessTokenData = {
  userId: string;
};

export type TokenCheckResult = {
  success: boolean;
  status: number;
  message: string;
  data: {
    userId: string;
    user?: DbUser;
  } | null;
};

export const __prod__ = process.env.NODE_ENV === "production";

const createAuthTokens = (
  user: DbUser,
): { refreshToken: string; accessToken: string } => {
  const refreshToken = jwt.sign(
    { userId: user.id, refreshTokenVersion: user.refreshTokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "30d",
    },
  );

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15min",
    },
  );

  return { refreshToken, accessToken };
};

// __prod__ is a boolean that is true when the NODE_ENV is "production"
const cookieOpts = {
  httpOnly: true,
  secure: __prod__,
  sameSite: "lax",
  path: "/",
  domain: __prod__ ? `.${process.env.DOMAIN}` : "",
  maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 year
} as const;

export const sendAuthCookies = (res: Response, user: DbUser) => {
  const { accessToken, refreshToken } = createAuthTokens(user);
  res.cookie("id", accessToken, cookieOpts);
  res.cookie("rid", refreshToken, cookieOpts);
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("id", cookieOpts);
  res.clearCookie("rid", cookieOpts);
};

export const checkTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<TokenCheckResult> => {
  try {
    // First try to verify access token
    const data = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as AccessTokenData;

    return {
      success: true,
      status: 200,
      message: "Valid access token",
      data: {
        userId: data.userId,
      },
    };
  } catch (error) {
    // Access token failed, try refresh token
    if (!refreshToken) {
      return {
        success: false,
        status: 401,
        message: "No refresh token provided",
        data: null,
      };
    }

    try {
      // 1. Verify refresh token
      const data = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as RefreshTokenData;

      // 2. Get user
      const user = await User.findById(data.userId);

      // 3. Check refresh token version
      if (!user || user.refreshTokenVersion !== data.refreshTokenVersion) {
        return {
          success: false,
          status: 401,
          message: "Invalid refresh token version",
          data: null,
        };
      }

      return {
        success: true,
        status: 200,
        message: "Valid refresh token",
        data: {
          userId: data.userId,
          user,
        },
      };
    } catch (error) {
      return {
        success: false,
        status: 401,
        message: "Invalid refresh token",
        data: null,
      };
    }
  }
};
