const mongoose = require("mongoose");

const Device = require("./Device");
const Session = require("./Session");
const Recording = require("./Recording");
const Segment = require("./Segment");
const Transcript = require("./Transcript");
const Insight = require("./Insight");
const ProcessingJob = require("./ProcessingJob");

/**
 * connectDB
 * Single entry point for connecting to MongoDB Atlas. Expects
 * MONGODB_URI in the environment, e.g.:
 *   mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/audio_outreach
 */
async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    maxPoolSize: 20,
  });
  return mongoose.connection;
}

module.exports = {
  connectDB,
  Device,
  Session,
  Recording,
  Segment,
  Transcript,
  Insight,
  ProcessingJob,
};
