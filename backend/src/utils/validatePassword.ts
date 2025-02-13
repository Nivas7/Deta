import bcrypt from "bcryptjs";
import type { DbUser } from "../types/userType.js";

async function validatePassword(
  user: DbUser,
  password: string,
): Promise<boolean> {
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return false;
  }
  return true;
}

export default validatePassword;
