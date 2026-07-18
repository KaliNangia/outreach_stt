const { Schema, model } = require("mongoose");

/**
 * Insight
 * A structured, actionable item extracted by the LLM from a Transcript:
 * a farmer query, concern, or recommendation. This is the primary object
 * exported downstream to the GDB.
 */
const InsightSchema = new Schema(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    transcript: {
      type: Schema.Types.ObjectId,
      ref: "Transcript",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["query", "concern", "recommendation"],
    },
    text: {
      type: String,
      required: true,
    },
    category: {
      // free-form taxonomy tag, e.g. "irrigation", "pest_control"; optional
      type: String,
      trim: true,
      default: null,
    },
    speakerLabel: {
      // denormalized from Transcript for quick filtering
      type: String,
      trim: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
    gdbExportStatus: {
      type: String,
      required: true,
      enum: ["pending", "exported", "failed"],
      default: "pending",
    },
    gdbExportedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

InsightSchema.index({ session: 1 });
InsightSchema.index({ type: 1 });
InsightSchema.index({ gdbExportStatus: 1 });
InsightSchema.index({ category: 1 });
InsightSchema.index({ text: "text" });

module.exports = model("Insight", InsightSchema);
