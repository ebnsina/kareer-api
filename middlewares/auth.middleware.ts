import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/constants.ts";

export function isAuth(req, res, next) {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
}

export function isAdmin(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
}
