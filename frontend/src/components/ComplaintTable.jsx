import React from "react";
import "../Dashboard.css";

const ComplaintTable = ({ complaints = [], role, onStatusChange, showAction }) => {
  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("en-IN");
  };

  return (
    <div className="complaint-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Room No</th>
            <th>Block</th>
            <th>Category</th>
            <th>Description</th>
            <th>File</th>
            <th>Date</th>
            <th>Status</th>
            {role === "warden" && showAction && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {complaints.length > 0 ? (
            complaints.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.student_room || "—"}</td>
                <td>{c.student_block || "—"}</td>
                <td>{c.category || "—"}</td>
                <td>{c.description || "—"}</td>
                <td>
                  {c.image_url ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <a href={c.image_url} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                      
                    </div>
                  ) : (
                    "No file"
                  )}
                </td>


                <td>{formatDate(c.created_at)}</td>
                <td style={{ color: c.status?.toLowerCase() === "resolved" ? "#16a34a" : "#f59e0b", fontWeight: "600" }}>
                  {c.status || "pending"}
                </td>
                {role === "warden" && showAction && (
                  <td>
                    <button
                      type="button"
                      className="btn-resolve"
                      onClick={() => onStatusChange && onStatusChange(c.id)}
                    >
                      Mark Resolved
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={role === "warden" ? 9 : 8} style={{ textAlign: "center" }}>
                No complaints found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintTable;
