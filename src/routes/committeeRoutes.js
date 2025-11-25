import { Router } from "express";
import { addCommitteeMember, updateCommitteeMember, getCommitteeMembers, deleteCommitteeMember, addReverend, getReverends } from "../controllers/committeeController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const committeeRouter = Router();

committeeRouter.post("/add", adminAuth, addCommitteeMember);
committeeRouter.put("/update/:id", adminAuth, updateCommitteeMember);
committeeRouter.get("/members", getCommitteeMembers);
committeeRouter.delete("/delete/:id", adminAuth, deleteCommitteeMember);
committeeRouter.post("/add-reverend", adminAuth, addReverend);
committeeRouter.get("/reverends", getReverends);

export default committeeRouter;