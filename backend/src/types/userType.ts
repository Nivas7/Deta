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

export interface LoginUserResturnType {
  userId: string;
  username: string;
  userEmail: string;
  token: string;
}

export interface userDocument extends CreateUserInput, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
