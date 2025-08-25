import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { createTrip, myTrips, updateTrip, deleteTrip, searchTrips } from "../controllers/tripController.js";
const r = Router();
r.get("/search", searchTrips); // public browse (limited info)
r.use(authRequired);
r.post("/details", createTrip);
r.get("/mine", myTrips);
r.patch("/:id", updateTrip);
r.delete("/:id", deleteTrip);
export default r;
