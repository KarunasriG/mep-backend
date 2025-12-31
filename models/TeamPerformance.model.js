// models/TeamPerformance.js
const teamPerformanceSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },

    totalDistance: Number,
    averageSpeed: Number,
    bestBullPair: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);
