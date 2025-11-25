import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import jwt from "jsonwebtoken";
import MemberModel from "../models/memberModal.js";

const dashboardRouter = Router();

// Middleware for authenticated users
const userAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const member = await MemberModel.findById(decoded.id);
    
    if (!member) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    req.user = member;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

dashboardRouter.get("/", userAuth, getDashboard);

export default dashboardRouter;