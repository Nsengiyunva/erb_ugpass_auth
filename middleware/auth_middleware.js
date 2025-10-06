import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token. Access denied." });
  }

  const token = authHeader.split(" ")[1];
  // const token = req.header("Authorization")?.replace("Bearer ", "");
  // if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, "erbsuperkey2025");
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
}

