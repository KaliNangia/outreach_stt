const { Schema, model } = require("mongoose");

/**
 * Recording
 * One audio stream belonging to a Session — either the "combined" master
 * recording, or one "individual" per-microphone / per-relay channel.
 * The actual audio bytes live on disk / object storage; this document
 * only ever holds a path/URL reference (see design decision: no GridFS).
 */
const RecordingSchema = new Schema(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    channelType: {
      type: String,
      required: true,
      enum: ["combined", "individual"],
    },
    device: {
      // the mic / relay phone this channel came from; null for "combined"
      type: Schema.Types.ObjectId,
      ref: "Device",
      default: null,
    },
    channelLabel: {
      // e.g. "combined", "mic_1", "relay_3"
      type: String,
      required: true,
      trim: true,
    },
    storagePath: {
      // final merged-file path/URL; set when the recording is finalized
      type: String,
      trim: true,
      default: null,
    },
    durationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    segmentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["recording", "finalized", "merged", "failed"],
      default: "recording",
    },
  },
  { timestamps: true }
);

RecordingSchema.index({ session: 1, channelType: 1 });
RecordingSchema.index({ session: 1, device: 1 });

module.exports = model("Recording", RecordingSchema);
