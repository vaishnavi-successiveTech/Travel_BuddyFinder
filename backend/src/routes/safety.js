import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { blockUser, getBlockedUsers, getMyReports, report, unblockUser } from "../controllers/safetyController.js";
const r = Router();
r.use(authRequired);
r.post("/block", blockUser);
r.post("/report", report);
r.post("/unblock", unblockUser);
r.get("/myReports", getMyReports);

r.get("/myBlockedUsers", authRequired, getBlockedUsers);

export default r;
