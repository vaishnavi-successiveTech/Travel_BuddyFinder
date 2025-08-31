import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getAllMatches, getMatches } from "../controllers/matchController.js";
const r = Router();
r.use(authRequired);
r.get("/:tripId", getMatches);
r.get("/",getAllMatches);
export default r;
