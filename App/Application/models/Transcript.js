const { Schema, model } = require("mongoose");

/**
 * Transcript
 * One diarized, transcribed speaker turn produced by the post-processing
 * pipeline. Multiple Transcripts per Session; each may yield zero or more
 * Insights.
 */
const TranscriptSchema = new Schema(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    recording: {
      // the channel this transcript was generated from
      type: Schema.Types.ObjectId,
      ref: "Recording",
      required: true,
    },
    speakerLabel: {
      // diarization-assigned id, e.g. "SPEAKER_00"
      type: String,
      required: true,
      trim: true,
    },
    language: {
      // BCP-47-ish tag; Punjabi/Gurmukhi is the mandatory default
      type: String,
      required: true,
      default: "pa-Guru",
    },
    startTimeSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    endTimeSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    text: {
      type: String,
      required: true,
    },
    asrConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
  },
  { timestamps: true }
);

TranscriptSchema.index({ session: 1 });
TranscriptSchema.index({ session: 1, speakerLabel: 1 });
TranscriptSchema.index({ text: "text" });

module.exports = model("Transcript", TranscriptSchema);
