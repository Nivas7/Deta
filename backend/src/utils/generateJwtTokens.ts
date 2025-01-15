import jwt from "jsonwebtoken";
import type { userDocument } from "../types/userType.js";

function generateJwtTokens(user: userDocument): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    },
  );
}

export default generateJwtTokens;
