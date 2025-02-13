import { Response } from "express";
import User from "../models/User.js";
import type {
  CreateUserInput,
  DbUser,
  LoginUserInput,
  LoginUserReturnType,
  ReturnType,
} from "../types/userType.js";
import getHashedPassword from "../utils/getHashedPassword.js";
import validatePassword from "../utils/validatePassword.js";
import {
  clearAuthCookies,
  sendAuthCookies,
} from "../utils/createAuthTokens.js";

export async function createUser(
  userData: CreateUserInput,
): Promise<ReturnType<Omit<DbUser, "password">>> {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser !== null) {
    return {
      success: false,
      status: 409,
      message: "User already exists",
      data: null,
    };
  }

  try {
    const hashedPasword = await getHashedPassword(userData.password);
    const newUser = await User.create({
      ...userData,
      password: hashedPasword,
    });

    return {
      success: true,
      status: 200,
      message: "User Created Sucessfully",
      data: newUser,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: error,
    };
  }
}

export async function logInUser(
  userCredentials: LoginUserInput,
  res: Response,
): Promise<ReturnType<LoginUserReturnType>> {
  const currentUser = await User.findOne({ email: userCredentials.email });

  if (!currentUser) {
    return {
      success: false,
      status: 401,
      message: "No account is associated with this email",
      data: null,
    };
  }

  const isPasswordValid = await validatePassword(
    currentUser,
    userCredentials.password,
  );

  if (!isPasswordValid) {
    return {
      success: false,
      status: 401,
      message: "Invalid pasword, Try agin",
      data: null,
    };
  }

  // Set auth cookies instead of returning token
  sendAuthCookies(res, currentUser);

  const user = {
    userId: currentUser.id,
    username: currentUser.username,
    userEmail: currentUser.email,
  };

  return {
    success: true,
    status: 200,
    message: "Login Successful",
    data: user,
  };
}

export async function logoutUser(
  res: Response,
): Promise<ReturnType<{ message: string }>> {
  try {
    clearAuthCookies(res);
    return {
      success: true,
      status: 200,
      message: "Logged out successfully",
      data: { message: "User logged out" },
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      message: "Logout failed",
      data: { message: error.message },
    };
  }
}

export async function refreshTokenVersion(
  userId: string,
): Promise<ReturnType<DbUser>> {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found",
        data: null,
      };
    }

    user.refreshTokenVersion = (user.refreshTokenVersion || 0) + 1;
    await user.save();

    return {
      success: true,
      status: 200,
      message: "Token version updated",
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 500,
      message: "Failed to update token version",
      data: null,
    };
  }
}
