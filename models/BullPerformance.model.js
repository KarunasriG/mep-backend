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
    distanceCovered: {
      type: Number,
      required: true,
      min: 0,
    },
    timeTaken: {
      type: Number,
      required: true,
      min: 0,
    },
    rockWeight: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BullPerformance", bullPerformanceSchema);
