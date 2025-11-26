import express from "express";
import { 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement, 
  getAnnouncements 
} from "../controllers/announcementController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Admin only routes
router.post("/create", adminAuth, createAnnouncement);
router.put("/update/:id", adminAuth, updateAnnouncement);
router.delete("/delete/:id", adminAuth, deleteAnnouncement);

// Public routes
router.get("/list", getAnnouncements);

export default router;