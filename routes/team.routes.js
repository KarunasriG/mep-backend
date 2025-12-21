import express from "express";
import {
  createTeam,
  getPendingTeams,
  decideTeam,
  getTeamById,
  getMyTeams,
  deactivateTeam,
  getTeamAudit,
} from "../controllers/team.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTeam);

router.get("/:teamId", protect, getTeamById);

router.get("/my-team", protect, getMyTeams);

router.get("/pending", protect, restrictTo("admin"), getPendingTeams);

router.patch("/:teamId/decision", protect, restrictTo("admin"), decideTeam);

router.patch("/:teamId/deactivate", protect, deactivateTeam);

//
router.get("/:teamId/audit", protect, restrictTo("admin"), getTeamAudit);

export default router;
