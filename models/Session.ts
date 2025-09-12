import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  sessionToken: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expires: Date,
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
