import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { registerForEvent } from "../controllers/eventRegistration.controller.js";

const router = express.Router();

// public
router.post("/:eventId/register", protect, registerForEvent);

export default router;
