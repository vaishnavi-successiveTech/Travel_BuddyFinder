import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middleware/rateLimiter.js";
import routes from "./routes/index.js"; // central router
import { connectDb } from "./config/db.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter(240));

// use all api routes
app.use("/api", routes);
connectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
