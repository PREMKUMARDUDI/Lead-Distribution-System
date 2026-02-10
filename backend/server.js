import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Create uploads folder if not exists
import fs from "fs";
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/leads", leadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
