import express from "express";
import { newMember, loginMember, updateMember } from "../controllers/memberController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/new-member", newMember);
authRouter.post("/login-member", loginMember);
authRouter.put("/update-member/:memberID", adminAuth, updateMember);

export default authRouter;
