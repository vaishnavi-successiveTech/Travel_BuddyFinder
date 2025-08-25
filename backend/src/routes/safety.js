import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { blockUser, report } from "../controllers/safetyController.js";
const r = Router();
r.use(authRequired);
r.post("/block", blockUser);
r.post("/report", report);
export default r;
