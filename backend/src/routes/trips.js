import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { createTrip, myTrips, updateTrip, deleteTrip, searchTrips, getMyCurrentTrip, alltrips } from "../controllers/tripController.js";
const r = Router();
r.get("/search", searchTrips); // public browse (limited info)

r.use(authRequired);
r.get("/all",authRequired,)
r.post("/details", authRequired,createTrip);
r.get ("/all",authRequired,alltrips)
r.get("/mine", authRequired,  myTrips);
r.get("/current", authRequired,getMyCurrentTrip);

r.patch("/:id", updateTrip);
r.delete("/:id", deleteTrip);
export default r;
