import express from "express";
import {
  addCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
  getCommitteeMembers,
  addReverend,
  getReverends
} from "../controllers/committeeController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Admin only routes
router.post("/add", adminAuth, addCommitteeMember);
router.put("/update/:id", adminAuth, updateCommitteeMember);
router.delete("/delete/:id", adminAuth, deleteCommitteeMember);
router.post("/add-reverend", adminAuth, addReverend);

// Public routes
router.get("/members", getCommitteeMembers);
router.get("/reverends", getReverends);

export default router;