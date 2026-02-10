import express from "express";
import { uploadLeads } from "../controllers/uploadController.js";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protect, upload.single("file"), uploadLeads);

export default router;
