import React, { useState, useContext } from "react";
import Sidebar from "../../components/Sidebar";
import { ComplaintContext } from "../../context/ComplaintContext";
import "../../Dashboard.css";

const RaiseComplaint = () => {
  const { addComplaint } = useContext(ComplaintContext);
  const user = JSON.parse(localStorage.getItem("user"));

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    { key: "Electrical Issues", icon: "fa-bolt" },
    { key: "Plumbing and Water Supply", icon: "fa-tint" },
    { key: "Cleanliness and Hygiene", icon: "fa-broom" },
    { key: "Furniture and Room Maintenance", icon: "fa-chair" },
    { key: "Security and Safety", icon: "fa-shield-alt" },
    { key: "Other / General Complaints", icon: "fa-ellipsis-h" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !description) {
      setStatusMsg("⚠ Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("category", category);
      formData.append("description", description);
      formData.append("block", user?.block);
      formData.append("room", user?.room);
      if (file) formData.append("file", file);

      await addComplaint(formData);

      setStatusMsg("✅ Complaint submitted successfully!");
      setCategory("");
      setDescription("");
      setFile(null);
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.error("❌ Error submitting complaint:", err);
      setStatusMsg("❌ Server error while submitting complaint.");
      setTimeout(() => setStatusMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />
      <div className="main-content">
        <h1 className="page-title">Raise Complaint</h1>
        <div className="complaint-form-card">
          <form onSubmit={handleSubmit}>
            <label style={{ fontWeight: 700, color: "#1e3a8a" }}>Complaint Category</label>
            <div className="category-grid" style={{ marginTop: "8px" }}>
              {categories.map((c) => (
                <div
                  key={c.key}
                  className={`category-card ${category === c.key ? "selected" : ""}`}
                  onClick={() => setCategory(c.key)}
                >
                  <i className={`fas ${c.icon}`} aria-hidden="true" />
                  <p style={{ marginTop: "8px" }}>{c.key}</p>
                </div>
              ))}
            </div>

            <label style={{ fontWeight: 700, color: "#1e3a8a" }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Describe your issue clearly"
              required
            />

            <label style={{ fontWeight: 700, color: "#1e3a8a" }}>Attach File (optional)</label>
            <div className="file-input-wrapper">
              <button
                type="button"
                className="file-btn"
                onClick={() => document.getElementById("fileInput").click()}
              >
                {file ? file.name : "Choose File"}
              </button>
              <input
                id="fileInput"
                type="file"
                name="image"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>

            {statusMsg && (
              <p className="status-msg" style={{ color: statusMsg.startsWith("✅") ? "green" : "red" }}>
                {statusMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaint;
