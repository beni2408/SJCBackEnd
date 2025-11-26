import express from "express";
import {
  changeUserRole,
  getAllMembers,
  getMembersByRole
} from "../controllers/superAdminController.js";
import { superAdminAuth } from "../middleware/superAdminAuth.js";

const router = express.Router();

// Super Admin only routes
router.put("/change-role", superAdminAuth, changeUserRole);
router.get("/all-members", superAdminAuth, getAllMembers);
router.get("/members-by-role/:role", superAdminAuth, getMembersByRole);

export default router;