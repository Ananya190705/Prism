import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mailer.js";
import User from "../models/user.js";

dotenv.config();

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= SIGNUP =================
export const signupUser = async (req, res) => {
  const { email, usn, role } = req.body;

  try {
    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required." });
    }

    let normalizedRole = role.trim().toLowerCase();
    if (["chief", "chiefwarden", "admin"].includes(normalizedRole)) {
      normalizedRole = "chief_warden";
    } else if (["warden"].includes(normalizedRole)) {
      normalizedRole = "warden";
    } else {
      normalizedRole = "student";
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({
        exists: true,
        message: "User already registered",
      });
    }

    await User.create({
      email,
      usn,
      role: normalizedRole,
      name: email.split("@")[0],
    });

    res.status(201).json({
      exists: false,
      message: "Signup successful",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup error" });
  }
};

// ================= SEND OTP =================
export const sendOtp = async (req, res) => {
  try {
    const { email, name, role = "student" } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    let normalizedRole = role.toLowerCase();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        role: normalizedRole
      });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otp_expires_at = expiresAt;
    await user.save();

    await sendMail({
      to: user.email,
      subject: "PRISM Login OTP",
      html: `<p>Your OTP is <b>${otp}</b></p>`
    });

    res.json({
      message: "OTP sent",
      userId: user._id,
      role: user.role,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP error" });
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, block, room } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otp) return res.status(400).json({ message: "No OTP" });

    if (new Date() > user.otp_expires_at)
      return res.status(400).json({ message: "OTP expired" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.role === "student") {
      user.block = block;
      user.room = room;
    }

    user.otp = null;
    user.otp_expires_at = null;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verify error" });
  }
};