import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  usn: String,
  role: String,
  otp: String,
  otp_expires_at: Date,
  block: String,
  room: String
});

export default mongoose.model("User", userSchema);