import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getMatches } from "../controllers/matchController.js";
const r = Router();
r.use(authRequired);
r.get("/:tripId", getMatches);
export default r;
