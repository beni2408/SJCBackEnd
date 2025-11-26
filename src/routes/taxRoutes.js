import express from "express";
import {
  setTaxAmount,
  updateTaxAmount,
  deleteTax,
  getAllTaxes,
  recordTaxPayment,
  updateTaxPayment,
  deleteTaxPayment,
  getTaxStatus,
  getTaxOverviewByID
} from "../controllers/taxController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

// Admin only routes
router.post("/set-amount", adminAuth, setTaxAmount);
router.put("/update-amount", adminAuth, updateTaxAmount);
router.delete("/delete", adminAuth, deleteTax);
router.get("/all", adminAuth, getAllTaxes);
router.post("/record-payment", adminAuth, recordTaxPayment);
router.put("/update-payment", adminAuth, updateTaxPayment);
router.delete("/delete-payment", adminAuth, deleteTaxPayment);
router.get("/overview/:taxID", adminAuth, getTaxOverviewByID);

// User routes (can check own family status)
router.get("/status/:hometaxno", userAuth, getTaxStatus);

export default router;