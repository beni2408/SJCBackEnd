import jwt from "jsonwebtoken";
import MemberModel from "../models/memberModal.js";

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const member = await MemberModel.findById(decoded.id);
    
    if (!member || member.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    
    req.user = member;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};