const { Schema, model } = require("mongoose");

/**
 * Device
 * Lightweight identity record for a Coordinator's laptop or an Organizer's
 * phone. No authentication — devices are identified by a generated UUID
 * persisted on the client, plus a human-readable display name.
 */
const DeviceSchema = new Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String,
      required: true,
      enum: ["coordinator", "organizer"],
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

DeviceSchema.index({ role: 1 });

module.exports = model("Device", DeviceSchema);
