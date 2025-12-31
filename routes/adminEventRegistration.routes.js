// routes/adminEventRegistration.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";
import {
  getRegistrationsByEvent,
  updateRegistrationStatus,
} from "../controllers/adminEventRegistration.controller.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/events/:eventId/registrations", getRegistrationsByEvent);

router.patch("/registrations/:registrationId/status", updateRegistrationStatus);

export default router;
