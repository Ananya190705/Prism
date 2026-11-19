import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [isReady, setIsReady] = useState(false);

  // 🔄 Listen for localStorage updates (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("userRole"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Small delay so token loads properly
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // 🚀 Fetch complaints from backend — corrected fully
  const fetchComplaints = async () => {
    if (!token) {
      setComplaints([]);
      return;
    }

    try {
      let url = "";

      if (role === "student") {
        url = "http://localhost:5000/api/complaints/my";
      } else if (role === "warden") {
        // ✔ Warden should get ALL complaints
        url = "http://localhost:5000/api/complaints";
      } else {
        // admin / chief warden
        url = "http://localhost:5000/api/complaints";
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComplaints(res.data);
    } catch (err) {
      console.error("❌ Error fetching complaints:", err);
      if (err.response?.status === 401) {
        console.warn("⚠️ Token expired or unauthorized. Please login again.");
      }
    }
  };

  // ➕ Add complaint (student)
  const addComplaint = async (complaint) => {
    if (!token) return;

    try {
      await axios.post("http://localhost:5000/api/complaints", complaint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchComplaints();
    } catch (err) {
      console.error("❌ Error adding complaint:", err.response?.data || err);
    }
  };

  // 🔁 Update complaint (warden)
  const updateComplaint = async (id, updates) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchComplaints();
    } catch (err) {
      console.error("❌ Error updating complaint:", err);
    }
  };

  // 🧹 Clear complaint state (logout)
  const clearComplaints = () => setComplaints([]);

  // ⏳ Fetch when token or role changes
  useEffect(() => {
    if (isReady && token) {
      fetchComplaints();
    } else if (!token) {
      setComplaints([]);
    }
  }, [token, role, isReady]);

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        fetchComplaints,
        addComplaint,
        updateComplaint,
        clearComplaints,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};
