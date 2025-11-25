import { Router } from "express";
import { createAnnouncement, updateAnnouncement, getAnnouncements, deleteAnnouncement } from "../controllers/announcementController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const announcementRouter = Router();

announcementRouter.post("/create", adminAuth, createAnnouncement);
announcementRouter.put("/update/:id", adminAuth, updateAnnouncement);
announcementRouter.get("/list", getAnnouncements);
announcementRouter.delete("/delete/:id", adminAuth, deleteAnnouncement);

export default announcementRouter;