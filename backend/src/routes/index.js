// import express from "express";
// import auth from "./auth.js";
// import trips from "./trips.js";
// import match from "./match.js";
// import safety from "./safety.js";
// import costs from "./costs.js";

// const router = express.Router();

// // mount all routes
// router.use("/auth", auth);
// router.use("/trips", trips);
// router.use("/match", match);
// router.use("/safety", safety);
// router.use("/costs", costs);

// export default router;
// routes/index.js
import express from "express";

import authRoutes from "./auth.js";
import tripRoutes from "./trips.js";
import matchRoutes from "./match.js";
import safetyRoutes from "./safety.js";
import costRoutes from "./costs.js";

const router = express.Router();

// mount all routes
router.use("/auth", authRoutes);
router.use("/trips", tripRoutes);
router.use("/match", matchRoutes);
router.use("/safety", safetyRoutes);
router.use("/costs", costRoutes);

export default router;
