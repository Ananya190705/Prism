import { sendMail } from "../utils/mailer.js";
import { Parser } from "json2csv";
import Complaint from "../models/complaint.js";
import User from "../models/user.js";

/* ================= CREATE COMPLAINT ================= */
export const createComplaint = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { category, description } = req.body;

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const image_url = req.file ? req.file.filename : null;

    const complaint = await Complaint.create({
      user_id,
      category,
      description,
      block: user.block,
      room: user.room,
      image_url
    });

    res.json({
      message: "Complaint submitted successfully",
      complaintId: complaint._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating complaint" });
  }
};

/* ================= GET MY COMPLAINTS ================= */
export const getMyComplaints = async (req, res) => {
  try {
    const user_id = req.user.id;

    const complaints = await Complaint.find({ user_id })
      .sort({ createdAt: -1 });

    res.json(complaints);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

/* ================= GET ALL COMPLAINTS ================= */
export const getAllComplaints = async (req, res) => {
  try {
    const role = req.user.role;

    if (!role) return res.status(401).json({ message: "Unauthorized" });

    // Escalate old complaints
    await Complaint.updateMany(
      {
        status: "pending",
        createdAt: { $lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
      },
      { status: "Escalated" }
    );

    let complaints;

    if (role === "student") {
      complaints = await Complaint.find({ user_id: req.user.id })
        .populate("user_id")
        .sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find()
        .populate("user_id")
        .sort({ createdAt: -1 });
    }

    res.json(complaints);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

/* ================= GET SINGLE ================= */
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user_id");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaint" });
  }
};

/* ================= GET RESOLVED ================= */
export const getResolvedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: "resolved" })
      .populate("user_id")
      .sort({ updatedAt: -1 });

    res.json(complaints);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching resolved complaints" });
  }
};

/* ================= NOTIFY WARDEN ================= */
export const notifyWarden = async (req, res) => {
  try {
    const { complaintId } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: "Not found" });

    const wardens = await User.find({ role: "warden" });

    for (const w of wardens) {
      await sendMail({
        to: w.email,
        subject: `Complaint ${complaintId}`,
        html: `<p>${complaint.description}</p>`
      });
    }

    res.json({ message: "Wardens notified" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error notifying" });
  }
};

/* ================= UPDATE STATUS ================= */
export const updateComplaintStatus = async (req, res) => {
  try {
    const { role } = req.user;
    if (!["warden", "chief_warden", "admin"].includes(role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { status, remark } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        remark,
        resolved_date: status === "resolved" ? new Date() : null
      },
      { new: true }
    ).populate("user_id");

    if (status === "resolved") {
      await sendMail({
        to: complaint.user_id.email,
        subject: "Complaint Resolved",
        html: `<p>Your complaint is resolved</p>`
      });
    }

    res.json(complaint);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating complaint" });
  }
};

/* ================= DELETE BY MONTH ================= */
export const deleteComplaintsByMonth = async (req, res) => {
  try {
    const { month, year } = req.body;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const result = await Complaint.deleteMany({
      createdAt: { $gte: start, $lt: end }
    });

    res.json({
      message: "Deleted",
      deleted: result.deletedCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting" });
  }
};

/* ================= EXPORT CSV ================= */
export const exportResolvedComplaintsCSV = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: "resolved" })
      .populate("user_id");

    const data = complaints.map(c => ({
      id: c._id,
      category: c.category,
      description: c.description,
      status: c.status,
      remark: c.remark,
      created_at: c.createdAt,
      resolved_date: c.resolved_date,
      student_email: c.user_id?.email,
      block: c.block,
      room: c.room
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("resolved.csv");
    res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error exporting CSV" });
  }
};