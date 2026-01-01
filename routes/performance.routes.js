import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getApprovedTeams,
  getLeaderboard,
  recordTeamPerformance,
  recordBullPerformance,
} from "../controllers/performance.controller.js";

const router = express.Router();

// Public Routes
router.get("/:eventId/approved-teams", getApprovedTeams);
router.get("/:eventId/leaderboard", getLeaderboard);

// Admin/Official Routes
router.use(protect, restrictTo("admin")); // Assuming 'admin' covers officials for now as per previous context

router.post("/:eventId/team-performance", recordTeamPerformance);
router.post("/:eventId/bull-performance", recordBullPerformance);

export default router;
