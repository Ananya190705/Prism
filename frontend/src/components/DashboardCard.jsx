import React from "react";
import "../Dashboard.css";

const DashboardCard = ({ title, count, topColor }) => {
    return (
        <div className="dashboard-card" style={{ borderTop: `5px solid ${topColor || "#0f172a"}` }}>
            <h3>{title}</h3>
            <p>{count}</p>
        </div>
    );
};

export default DashboardCard;
