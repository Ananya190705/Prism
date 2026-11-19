import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPageWithOTP.css";

const LoginPageWithOTP = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const hostelBlocks = ["4G", "2G", "3G", "NANDINI", "5B", "6G"];

  // Generate room numbers
  const generateRoomNumbers = () => {
    const rooms = [];
    for (let floor = 0; floor <= 3; floor++) {
      for (let i = 1; i <= 16; i++) {
        rooms.push(`${floor}${i.toString().padStart(2, "0")}`);
      }
    }
    return rooms;
  };
  const roomNumbers = generateRoomNumbers();

  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (!email || !role) {
      setStatusMsg("⚠️ Please enter your email and select a role.");
      return;
    }

    if (role === "student" && (!block || !room)) {
      setStatusMsg("⚠️ Please fill Block and Room details.");
      return;
    }

    try {
      setLoading(true);
      setStatusMsg("📩 Sending OTP...");

      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email,
        role,
      });

      // ✅ FIX: check status instead of message
      if (res.status === 200) {
        setShowOtp(true);
        setStatusMsg("✅ OTP sent! Check your email.");
      } else {
        setStatusMsg("❌ Failed to send OTP. Try again.");
      }
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      setStatusMsg(err.response?.data?.message || "❌ Server error while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    if (!otp) {
      setStatusMsg("⚠️ Please enter your OTP.");
      return;
    }

    try {
      setLoading(true);
      setStatusMsg("🔍 Verifying OTP...");

      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
        block,
        room,
      });

      if (res.data.token) {
        setStatusMsg("✅ Login successful! Redirecting...");

        localStorage.clear();

        const userRole = res.data.user.role.toLowerCase();

        const loggedInUser = {
          name: res.data.user.name || email.split("@")[0],
          email: res.data.user.email,
          role: userRole,
          block: block || "N/A",
          room: room || "N/A",
        };

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userEmail", res.data.user.email);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        setTimeout(() => {
          if (userRole === "student") {
            localStorage.setItem("studentBlock", block);
            localStorage.setItem("studentRoom", room);
            navigate("/student/raise-complaint");
          } else if (userRole === "warden") {
            navigate("/warden/dashboard");
          } else if (userRole === "chief_warden" || userRole === "admin") {
            navigate("/admin/dashboard");
          } else {
            setStatusMsg("❌ Unauthorized role.");
            navigate("/login");
          }
        }, 1000);
      } else {
        setStatusMsg("❌ Invalid OTP or user not found.");
      }
    } catch (err) {
      console.error("❌ OTP Verification Error:", err);
      setStatusMsg(err.response?.data?.message || "❌ Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ENTER KEY ================= */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (!showOtp) handleSendOtp();
      else handleVerifyOtp();
    }
  };

  return (
    <div className="otp-container" onKeyDown={handleKeyPress} tabIndex="0">
      <div className="otp-card">
        <h2>Smart Hostel Login</h2>

        {!showOtp ? (
          <div className="otp-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="warden">Warden</option>
              <option value="chief_warden">Chief Warden</option>
            </select>

            {role === "student" && (
              <>
                <select value={block} onChange={(e) => setBlock(e.target.value)}>
                  <option value="">Select Hostel Block</option>
                  {hostelBlocks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                <select value={room} onChange={(e) => setRoom(e.target.value)}>
                  <option value="">Select Room Number</option>
                  {roomNumbers.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </>
            )}

            <button onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="otp-form">
            <input
              type="text"
              placeholder="Enter OTP from your Email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />

            <button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {statusMsg && <p className="status-msg">{statusMsg}</p>}
      </div>
    </div>
  );
};

export default LoginPageWithOTP;