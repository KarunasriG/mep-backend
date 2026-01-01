import Event from "../models/Event.model.js";
import EventRegistration from "../models/EventRegistration.model.js";
import TeamPerformance from "../models/TeamPerformance.model.js";
import BullPerformance from "../models/BullPerformance.model.js";

/**
 * GET APPROVED TEAMS (Public)
 * Returns teams in registration order
 * Includes 'hasPlayed' flag
 */
export const getApprovedTeams = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // 1. Get all approved registrations sorted by creation time
    const registrations = await EventRegistration.find({
      event: eventId,
      status: "APPROVED",
    })
      .populate("team", "teamName teamMembers bullPairs")
      .populate("registeredBy", "username")
      .sort({ createdAt: 1 });

    // 2. Get all performance records for this event to check who played
    const performances = await TeamPerformance.find({ event: eventId }).select(
      "team"
    );
    const playedTeamIds = new Set(performances.map((p) => p.team.toString()));

    // 3. Map to response format
    const teams = registrations.map((reg, index) => ({
      registrationId: reg._id,
      team: reg.team,
      captainName: reg.captainName,
      registrationOrder: index + 1,
      hasPlayed: playedTeamIds.has(reg.team._id.toString()),
    }));

    res.status(200).json({
      status: "success",
      data: teams,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET LEADERBOARD (Public)
 * Sorted by Distance (DESC), Time (ASC), Rock Weight (DESC)
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const leaderboard = await TeamPerformance.find({ event: eventId })
      .populate("team", "teamName")
      .sort({ distanceCovered: -1, timeTaken: 1, rockWeight: -1 });

    res.status(200).json({
      status: "success",
      data: leaderboard,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * RECORD TEAM PERFORMANCE (Admin/Official)
 */
export const recordTeamPerformance = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { teamId, distanceCovered, timeTaken, rockWeight } = req.body;

    // 1. Validate Event Status
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found" });
    }
    // Allow performance recording if event is ONGOING (LIVE)
    if (event.state !== "ONGOING") {
      return res.status(400).json({
        status: "fail",
        message: "Performance can only be recorded when event is LIVE (ONGOING)",
      });
    }

    // 2. Validate Team Approval
    const registration = await EventRegistration.findOne({
      event: eventId,
      team: teamId,
      status: "APPROVED",
    });

    if (!registration) {
      return res.status(400).json({
        status: "fail",
        message: "Team is not approved for this event",
      });
    }

    // 3. Check for Duplicate Performance
    const existing = await TeamPerformance.findOne({
      event: eventId,
      team: teamId,
    });
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "Performance already recorded for this team",
      });
    }

    // 4. Calculate Registration Order
    // (Count how many approved registrations were created before this one)
    const order = await EventRegistration.countDocuments({
      event: eventId,
      status: "APPROVED",
      createdAt: { $lt: registration.createdAt },
    });
    const registrationOrder = order + 1;

    // 5. Create Performance Record
    const performance = await TeamPerformance.create({
      event: eventId,
      team: teamId,
      registrationOrder,
      distanceCovered,
      timeTaken,
      rockWeight,
      recordedBy: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: performance,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * RECORD BULL PERFORMANCE (Admin/Official)
 */
export const recordBullPerformance = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { teamId, bullName, distanceCovered, timeTaken, rockWeight } = req.body;

    const performance = await BullPerformance.create({
      event: eventId,
      team: teamId,
      bullName,
      distanceCovered,
      timeTaken,
      rockWeight,
    });

    res.status(201).json({
      status: "success",
      data: performance,
    });
  } catch (err) {
    next(err);
  }
};
