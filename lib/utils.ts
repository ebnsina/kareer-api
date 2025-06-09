import jwt from "npm:jsonwebtoken";
import { JWT_SECRET } from "./constants.ts";

interface User {
  _id: string;
  role: string;
}

export function generateToken(user: User) {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return token;
}
