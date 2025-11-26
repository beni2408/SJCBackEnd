import jwt from "jsonwebtoken";
import MemberModel from "../models/memberModal.js";

export const userAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await MemberModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token. User not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};