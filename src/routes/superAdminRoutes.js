import { Router } from "express";
import { changeUserRole, getAllMembers, getMembersByRole } from "../controllers/superAdminController.js";
import { superAdminAuth } from "../middleware/superAdminAuth.js";

const superAdminRouter = Router();

superAdminRouter.put("/change-role", superAdminAuth, changeUserRole);
superAdminRouter.get("/all-members", superAdminAuth, getAllMembers);
superAdminRouter.get("/members-by-role/:role", superAdminAuth, getMembersByRole);

export default superAdminRouter;