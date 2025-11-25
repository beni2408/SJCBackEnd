import { Router } from "express";
import { recordMonthlyOffering, recordSpecialOffering, getMonthlyOfferingStatus } from "../controllers/offeringController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import jwt from "jsonwebtoken";
import MemberModel from "../models/memberModal.js";

const offeringRouter = Router();

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

offeringRouter.post("/monthly", adminAuth, recordMonthlyOffering);
offeringRouter.post("/special", adminAuth, recordSpecialOffering);
offeringRouter.get("/monthly-status/:hometaxno", userAuth, getMonthlyOfferingStatus);

export default offeringRouter;