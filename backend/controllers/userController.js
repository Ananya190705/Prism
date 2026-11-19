 import User from "../models/user.js";

/* ================= GET PROFILE ================= */
export const getProfile = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email }).select(
      "name email usn block room"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });

  } catch (err) {
    console.error("❌ Error in getProfile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { email, name, usn, block, room } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { name, usn, block, room },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ Profile updated for ${email}`);

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (err) {
    console.error("❌ Error in updateProfile:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};