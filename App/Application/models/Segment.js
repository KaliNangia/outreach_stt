const { Schema, model } = require("mongoose");

/**
 * Segment
 * A single ~10-minute chunk of a Recording, written as it is captured
 * during a live session. Kept as its own collection (rather than an
 * embedded array on Recording) so concurrent writers — one per mic/relay
 * channel — never contend for the same parent document, and so a single
 * Recording can never approach the 16MB document limit over a long session.
 */
const SegmentSchema = new Schema(
  {
    recording: {
      type: Schema.Types.ObjectId,
      ref: "Recording",
      required: true,
    },
    session: {
      // denormalized for cheap session-wide segment queries
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    sequenceNumber: {
      type: Number,
      required: true,
      min: 0,
    },
    storagePath: {
      type: String,
      required: true,
      trim: true,
    },
    durationSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: Date,
  },
  { timestamps: true }
);

SegmentSchema.index({ recording: 1, sequenceNumber: 1 }, { unique: true });
SegmentSchema.index({ session: 1, startedAt: 1 });

module.exports = model("Segment", SegmentSchema);
