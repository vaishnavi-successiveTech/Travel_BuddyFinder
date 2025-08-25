import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { splitCosts } from "../controllers/costController.js";
const r = Router();
r.use(authRequired);
r.post("/split", splitCosts);
export default r;
