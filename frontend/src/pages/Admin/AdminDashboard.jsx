import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../../components/Sidebar";
import DashboardCard from "../../components/DashboardCard";
import ComplaintTable from "../../components/ComplaintTable";
import { ComplaintContext } from "../../context/ComplaintContext";

import "../../Dashboard.css";

const AdminDashboard = () => {
  const { complaints, fetchComplaints } = useContext(ComplaintContext);
  const navigate = useNavigate();

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // For delete-by-month
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Check login + fetch complaints
  useEffect(() => {
    if (!token || (role !== "admin" && role !== "chief_warden")) {
      alert("Unauthorized access! Please login as Admin.");
      navigate("/login");
      return;
    }
    fetchComplaints();
  }, [token, role, fetchComplaints, navigate]);

  // DELETE complaints by month
  const deleteByMonth = async () => {
    if (!month || !year) {
      alert("Please select month and enter year!");
      return;
    }

    try {
      await axios({
        method: "DELETE",
        url: "http://localhost:5000/api/complaints/delete-by-month",
        headers: { Authorization: `Bearer ${token}` },
        data: { month: Number(month), year: Number(year) } // ✅ convert to number
      });

      alert("Complaints deleted successfully!");
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Failed to delete complaints");
    }
  };

  // ⭐ DOWNLOAD CSV FUNCTION
  const downloadCSV = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/complaints/export/resolved",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resolved_complaints.csv";
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      alert("Failed to download CSV");
    }
  };


  // Stats
  const total = complaints.length;
  const pending = complaints.filter(c => c.status?.toLowerCase() === "pending").length;
  const resolved = complaints.filter(c => c.status?.toLowerCase() === "resolved").length;
  const escalated = complaints.filter(
    c => c.status?.toLowerCase() === "escalated"
  ).length;


  return (
    <div className="dashboard-container">
      <Sidebar role="admin" />

      <div className="main-content">
        <div className="top-bar">
          <h2>Admin Dashboard</h2>
        </div>

        {/* Dashboard Cards */}
        <div className="cards">
          <DashboardCard title="Total Complaints" count={total} topColor="blue" />
          <DashboardCard title="Pending" count={pending} topColor="yellow" />
          <DashboardCard title="Resolved" count={resolved} topColor="green" />
          <DashboardCard title="Escalated" count={escalated} topColor="red" />
        </div>

        {/* Delete Complaints Section - Only for Chief Warden */}
        {role === "chief_warden" && (
          <div className="delete-section" style={{ marginTop: "30px" }}>
            <h2>Delete Complaints by Month/Year & Download CSV File</h2>

            <div className="delete-form">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString("en", { month: "long" })}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Enter Year (Ex: 2025)"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />

              <button
                className="danger-btn"
                onClick={() => setShowConfirm(true)}
                disabled={!month || !year}
              >
                Delete Complaints
              </button>
            </div>
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <button onClick={downloadCSV} className="primary-btn">
                Download Resolved Complaints CSV
              </button>
            </div>
            {/* Confirmation Modal */}
            {showConfirm && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Are you sure?</h3>
                  <p>This will permanently delete all complaints from {month}/{year}.</p>
                  <div className="modal-actions">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        deleteByMonth();
                        setShowConfirm(false);
                      }}
                      className="confirm-btn"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Complaint Table */}
        <h3 style={{ marginTop: "40px" }}>All Complaints</h3>
        {complaints.length > 0 ? (
          <ComplaintTable complaints={complaints} role="admin" showAction={false} />
        ) : (
          <p>No complaints found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
