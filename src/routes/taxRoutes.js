import { Router } from "express";
import { setTaxAmount, updateTaxAmount, deleteTax, getAllTaxes, getTaxOverviewByID, recordTaxPayment, updateTaxPayment, deleteTaxPayment, getTaxStatus } from "../controllers/taxController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import jwt from "jsonwebtoken";
import MemberModel from "../models/memberModal.js";

const taxRouter = Router();

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

taxRouter.post("/set-amount", adminAuth, setTaxAmount);
taxRouter.put("/update-amount", adminAuth, updateTaxAmount);
taxRouter.delete("/delete", adminAuth, deleteTax);
taxRouter.get("/all", adminAuth, getAllTaxes);
taxRouter.get("/overview-by-id/:taxID", adminAuth, getTaxOverviewByID);
taxRouter.post("/record-payment", adminAuth, recordTaxPayment);
taxRouter.put("/update-payment", adminAuth, updateTaxPayment);
taxRouter.delete("/delete-payment", adminAuth, deleteTaxPayment);
taxRouter.get("/status/:hometaxno", userAuth, getTaxStatus);

export default taxRouter;