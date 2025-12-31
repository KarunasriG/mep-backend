import EventRegistration from "../models/EventRegistration.model.js";

export const getRegistrationsByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const registrations = await EventRegistration.find({ event: eventId })
      .populate("team", "teamName")
      .populate("registeredBy", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: registrations,
    });
  } catch (err) {
    next(err);
  }
};

export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const { status, reason } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status",
      });
    }

    const registration = await EventRegistration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({
        status: "fail",
        message: "Registration not found",
      });
    }

    if (registration.status !== "PENDING") {
      return res.status(400).json({
        status: "fail",
        message: "Only PENDING registrations can be updated",
      });
    }

    if (status === "REJECTED" && !reason) {
      return res.status(400).json({
        status: "fail",
        message: "Rejection reason required",
      });
    }

    registration.status = status;
    registration.rejectionReason = status === "REJECTED" ? reason : undefined;
    await registration.save();

    res.status(200).json({
      status: "success",
      data: registration,
    });
  } catch (err) {
    next(err);
  }
};
