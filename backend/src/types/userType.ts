import type { Document } from "mongoose";

export interface ReturnType<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | string | null;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserReturnType {
  userId: string;
  username: string;
  userEmail: string;
}

export interface DbUser extends Document {
  username: string;
  email: string;
  password: string;
  refreshTokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}
