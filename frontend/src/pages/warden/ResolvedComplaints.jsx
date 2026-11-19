import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import "../../Dashboard.css";

const ResolvedComplaints = () => {
  const [resolved, setResolved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("⚠ No token found. Please login.");
      setLoading(false);
      return;
    }

    const fetchResolved = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/complaints/resolved",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Resolved complaints fetched:", res.data);
        setResolved(res.data);
      } catch (err) {
        console.error(
          "❌ Error fetching resolved complaints:",
          err.response || err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResolved();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar role="warden" />
      <div className="main-content">
        <h2 className="page-title">Resolved Complaints</h2>

        {loading ? (
          <p>Loading resolved complaints...</p>
        ) : resolved.length === 0 ? (
          <p>No resolved complaints.</p>
        ) : (
          <div className="complaint-table">
            <table style={{ width: "100%", tableLayout: "fixed" }}>
              {/* Optional: Set equal column widths */}
              <colgroup>
                <col style={{ width: "15%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "35%" }} />
                <col style={{ width: "15%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Resolved Date</th>
                  <th>Block</th>
                  <th>Room</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {resolved.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.resolved_date
                        ? new Date(c.resolved_date).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                        : "—"}
                    </td>
                    <td>{c.student_block || "—"}</td>
                    <td>{c.student_room || "—"}</td>

                    <td>{c.category || "—"}</td>
                    <td>{c.description || "—"}</td>
                    <td style={{ color: "#16a34a", fontWeight: "600" }}>
                      {c.status || "Resolved"}
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

export default ResolvedComplaints;
