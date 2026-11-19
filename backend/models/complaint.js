import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  category: String,
  description: String,
  block: String,
  room: String,
  image_url: String,
  status: { type: String, default: "pending" },
  remark: String,
  resolved_date: Date
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);