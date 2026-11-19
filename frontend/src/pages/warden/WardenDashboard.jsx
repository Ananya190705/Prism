import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ComplaintContext } from "../../context/ComplaintContext";
import Sidebar from "../../components/Sidebar";
import DashboardCard from "../../components/DashboardCard";
import ComplaintTable from "../../components/ComplaintTable";
import "../../Dashboard.css";

const WardenDashboard = () => {
  const { complaints, fetchComplaints } = useContext(ComplaintContext);
  const token = localStorage.getItem("token");

  const pendingCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;

  const [resolvedCount, setResolvedCount] = useState(0);

  useEffect(() => {
    const fetchResolvedCount = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/complaints/resolved",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResolvedCount(res.data.length);
      } catch (err) {
        console.error("❌ Error fetching resolved complaints:", err);
      }
    };
    fetchResolvedCount();
  }, [token]);

  const handleStatusChange = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        { status: "resolved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Complaint marked as resolved and student notified!");
      await fetchComplaints();
    } catch (error) {
      console.error("❌ Error updating complaint:", error);
      alert("Failed to update complaint. Try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="warden" />
      <div className="main-content">
        <div className="top-bar">
          <h2>Warden Dashboard</h2>
        </div>

        <div className="cards">
          <DashboardCard title="Total Complaints" count={complaints.length} topColor="blue" />
          <DashboardCard title="Pending" count={pendingCount} topColor="red" />
          <DashboardCard title="Resolved" count={resolvedCount} topColor="green" />
        </div>

        <h3 style={{ marginTop: "20px" }}>All Complaints</h3>
        {complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <ComplaintTable
            complaints={complaints}
            role="warden"
            showAction={true}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
};

export default WardenDashboard;
