import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { ComplaintContext } from "../../context/ComplaintContext";
import axios from "axios";
import "../../Dashboard.css";

const UnresolvedComplaints = () => {
  const { complaints, fetchComplaints } = useContext(ComplaintContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    if (!token || (role !== "admin" && role !== "chief_warden")) {
      alert("Unauthorized access! Please login as Admin/Chief Warden.");
      navigate("/login");
      return;
    }
    fetchComplaints();
  }, [token, role]);

  const now = new Date();

  // ⭐ SAME ESCALATION LOGIC
  const escalatedComplaints = complaints.filter((c) => {
    if (c.status?.toLowerCase() === "resolved" || !c.created_at) return false;

    const diffDays =
      (now - new Date(c.created_at)) / (1000 * 60 * 60 * 24);

    return diffDays > 3;
  });

  // ⭐ Notify Warden
  const notifyWarden = async (id) => {
    try {
      await axios.post(
        "http://localhost:5000/api/complaints/notify-warden",
        { complaintId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("📩 Warden notified successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to notify the warden.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />
      <div className="main-content">
        <h1 className="page-title">Escalated Complaints (Unresolved)</h1>

        {escalatedComplaints.length === 0 ? (
          <p>No escalated complaints 🎉</p>
        ) : (
          <div className="complaint-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Room</th>
                  <th>Block</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Notify Warden</th>
                </tr>
              </thead>

              <tbody>
                {escalatedComplaints.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.room}</td>
                    <td>{c.block}</td>
                    <td>{c.category}</td>
                    <td>{c.description}</td>
                    <td>
                      {new Date(c.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td style={{ color: "red", fontWeight: 600 }}>
                      Escalated
                    </td>
                    <td>
                      <button
                        className="btn-resolve"
                        style={{ backgroundColor: "red" }}
                        onClick={() => notifyWarden(c.id)}
                      >
                        Notify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnresolvedComplaints;
