const { Schema, model } = require("mongoose");

/**
 * Session
 * One bounded outreach event. Root of the data model — every Recording,
 * Transcript, Insight, and ProcessingJob hangs off a Session.
 *
 * Three setupModes are supported:
 *   - "wired" / "wireless": a live-recorded session. coordinatorDevice is
 *     a real Device that ran/hosted the recording.
 *   - "manual": an archival import — an existing audio file or a folder
 *     of session recordings, submitted through a GUI form rather than
 *     captured live. There is no operating Device in this case (the
 *     person filling out the form did not run a live session), so
 *     coordinatorDevice is intentionally left null and the submitted
 *     metadata lives in archivalMeta instead. See archivalMeta.reportingManager
 *     — this is a free-text organizational role, not the same concept as
 *     coordinatorDevice, and must not be coerced into that field.
 */
const SessionSchema = new Schema(
  {
    sessionCode: {
      // human-readable, e.g. "2026-07-09-ROPAR-01"; generated at creation
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    setupMode: {
      type: String,
      required: true,
      enum: ["wired", "wireless", "manual"],
    },
    coordinatorDevice: {
      // required for "wired"/"wireless" only; left null for "manual"
      // imports, where no live Device ever operated the session
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: function () {
        return this.setupMode !== "manual";
      },
      default: null,
    },
    relayDevices: [
      {
        // populated only for wireless sessions
        type: Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
    location: {
      name: { type: String, trim: true }, // e.g. village / block name
      point: {
        type: { type: String, enum: ["Point"] },
        coordinates: { type: [Number] },
      },
    },
    archivalMeta: {
      // populated only when setupMode === "manual"; the fields entered
      // via the GUI import form, passed through as CLI flags to
      // process-file / process-folder
      village: { type: String, trim: true, default: null },
      district: { type: String, trim: true, default: null },
      block: { type: String, trim: true, default: null },
      reportingManager: { type: String, trim: true, default: null }, // NOT a Device reference — organizational role, free text
      language: { type: String, trim: true, default: null }, // required by the CLI, no default — validate at form level
      requestedDate: { type: Date, default: null }, // corresponds to --date; CLI defaults to current date if omitted
      model: {
        type: String,
        enum: ["performance", "efficient"],
        default: null,
      },
      sourcePath: { type: String, trim: true, default: null }, // the selected file or folder path
      importKind: {
        type: String,
        enum: ["file", "folder"],
        default: null,
      },
    },
    status: {
      type: String,
      required: true,
      enum: [
        "configuring",
        "recording",
        "ended",
        "processing",
        "completed",
        "failed",
      ],
      default: "configuring",
    },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

SessionSchema.index({ coordinatorDevice: 1, startedAt: -1 }, { sparse: true });
SessionSchema.index({ status: 1 });
SessionSchema.index({ setupMode: 1 });
SessionSchema.index({ "location.point": "2dsphere" }, { sparse: true });

module.exports = model("Session", SessionSchema);
