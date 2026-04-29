import express from "express";
import { sendContactMessage } from "../controllers/contactController";

const router = express.Router();

// Endpoint: POST /api/contact
router.post("/", sendContactMessage);

export default router;
