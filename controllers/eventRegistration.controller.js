import Event from "../models/Event.model.js";
import EventRegistration from "../models/EventRegistration.model.js";
import Team from "../models/Team.model.js";

export const registerForEvent = async (req, res, next) => {
  try {
    const { captainName, bullPairs, teamMembers = [] } = req.body;
    const { eventId } = req.params;

    // Basic payload validation
    if (!captainName || !Array.isArray(bullPairs) || bullPairs.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Captain name and at least one bull pair are required",
      });
    }

    console.log("RAW bullPairs from req:", bullPairs);
    bullPairs.forEach((bp, i) => {
      console.log(i, bp, typeof bp);
    });

    //  Event validation
    const event = await Event.findById(eventId).lean();
    if (!event) {
      return res.status(404).json({
        status: "fail",
        message: "Event not found",
      });
    }

    if (event.state !== "UPCOMING") {
      return res.status(400).json({
        status: "fail",
        message: "Event is not open for registration",
      });
    }

    const now = Date.now();
    const registrationDeadline = event.timings.to.getTime();

    if (now >= registrationDeadline) {
      return res.status(400).json({
        status: "fail",
        message: "Registration closed for this event",
      });
    }

    // Resolve user's APPROVED team via membership
    const team = await Team.findOne({
      status: "APPROVED",
      isActive: true,
      createdBy: req.user.id,
    });

    if (!team) {
      return res.status(403).json({
        status: "fail",
        message: "User is not part of any approved team",
      });
    }

    // Validate bullPairs belong to team
    console.log("team.bullPairs", team.bullPairs);
    const teamBullIds = team.bullPairs.map((bp) => bp._id.toString());
    console.log("teamBullIds", teamBullIds);

    const invalidBull = bullPairs.some((id) => !teamBullIds.includes(id));
    console.log("invalidBull", invalidBull);

    if (invalidBull) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid bull pair selection",
      });
    }

    //  Validate teamMembers belong to team (if provided)
    const validMemberIds = team.teamMembers.map((tm) => tm._id.toString());

    const invalidMember = teamMembers.some(
      (id) => !validMemberIds.includes(id)
    );
    if (invalidMember) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid team member selection",
      });
    }

    // Create registration
    const registration = await EventRegistration.create({
      event: eventId,
      team: team._id,
      captainName,
      bullPairs,
      teamMembers,
      registeredBy: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: registration,
    });
  } catch (err) {
    // Duplicate registration (event + team)
    if (err.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Your team is already registered for this event",
      });
    }
    next(err);
  }
};

// get approved participants

export const getApprovedParticipants = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const participants = await EventRegistration.find({
      event: eventId,
      status: "APPROVED",
    }).populate("team", "teamName");

    res.status(200).json({
      status: "success",
      data: participants,
    });
  } catch (err) {
    next(err);
  }
};
