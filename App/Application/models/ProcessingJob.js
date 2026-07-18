const { Schema, model } = require("mongoose");

/**
 * ProcessingJob
 * Tracks the status of each stage of the post-processing pipeline for a
 * Session, for observability/debugging. Not called out as a distinct data
 * entity in the SRS, but added here so pipeline progress and failures are
 * queryable rather than only visible in logs.
 */
const ProcessingJobSchema = new Schema(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    stage: {
      type: String,
      required: true,
      enum: [
        "ingestion",
        "resampling",
        "noise_suppression",
        "diarization",
        "splitting",
        "transcription",
        "insight_generation",
        "gdb_export",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },
    startedAt: Date,
    completedAt: Date,
    errorMessage: {
      type: String,
      default: null,
    },
    attemptCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

ProcessingJobSchema.index({ session: 1, stage: 1 }, { unique: true });
ProcessingJobSchema.index({ status: 1 });

module.exports = model("ProcessingJob", ProcessingJobSchema);
