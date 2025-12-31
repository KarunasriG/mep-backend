// models/BullPerformance.js
import mongoose from "mongoose";

const bullPerformanceSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    bullPair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BullPair",
      required: true,
    },

    distancePulledMeters: {
      type: Number,
      required: true,
      min: 0,
    },

    rockWeightKg: {
      type: Number,
      required: true,
      min: 0,
    },

    timeTakenMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BullPerformance", bullPerformanceSchema);
