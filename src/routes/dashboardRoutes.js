import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.get("/", userAuth, getDashboard);

export default router;