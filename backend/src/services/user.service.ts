import User from "../models/User.js";
import {
  CreateUserInput,
  LoginUserInput,
  LoginUserResturnType,
  ReturnType,
  userDocument,
} from "../types/userType.js";
import generateJwtTokens from "../utils/generateJwtTokens.js";
import getHashedPassword from "../utils/getHashedPassword.js";
import validatePassword from "../utils/validatePassword.js";

export async function createUser(
  userData: CreateUserInput,
): Promise<ReturnType<Omit<userDocument, "password">>> {
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
): Promise<ReturnType<LoginUserResturnType>> {
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

  const token = generateJwtTokens(currentUser);

  const user = {
    userId: currentUser.id,
    username: currentUser.username,
    userEmail: currentUser.email,
    token,
  };
  return {
    success: true,
    status: 200,
    message: "Login Successful",
    data: user,
  };
}
