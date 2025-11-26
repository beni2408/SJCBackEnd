import express from "express";
import {
  recordMonthlyOffering,
  updateMonthlyOffering,
  deleteMonthlyOffering,
  getAllMonthlyOfferings,
  recordSpecialOffering,
  updateSpecialOffering,
  deleteSpecialOffering,
  getAllSpecialOfferings,
  getMonthlyOfferingStatus
} from "../controllers/offeringController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

// Admin only routes
router.post("/monthly", adminAuth, recordMonthlyOffering);
router.put("/update-monthly", adminAuth, updateMonthlyOffering);
router.delete("/delete-monthly", adminAuth, deleteMonthlyOffering);
router.get("/all-monthly", adminAuth, getAllMonthlyOfferings);
router.post("/special", adminAuth, recordSpecialOffering);
router.put("/update-special/:id", adminAuth, updateSpecialOffering);
router.delete("/delete-special/:id", adminAuth, deleteSpecialOffering);
router.get("/all-special", adminAuth, getAllSpecialOfferings);

// User routes
router.get("/monthly-status/:hometaxno", userAuth, getMonthlyOfferingStatus);

export default router;