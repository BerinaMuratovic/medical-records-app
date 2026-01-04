import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../api";
import "../../style.css";

export default function AdminNotifications() {
  const [admin, setAdmin] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setAdmin(u);

    if (!u) return;

    api.get(`/notifications/user/${u.id}`)
      .then(res => setNotifications(res.data))
      .catch(() => alert("Failed to load notifications"));
  }, []);

  return (
    <div className="patient-layout">
      <AdminSidebar />
      <div className="content-area">
        <PatientHeader user={admin} />

        <main className="patient-content">
          <h2>Admin Notifications</h2>

          {notifications.length === 0 ? (
            <p>No notifications.</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="notification-card">
                <strong>{n.message}</strong>
                <span>{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
