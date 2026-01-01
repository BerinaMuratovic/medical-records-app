import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import PatientHeader from "../../components/PatientHeader";
import "../../style.css";

export default function AdminNotifications() {
  const [admin, setAdmin] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setAdmin(u);

    if (!u) return;

    fetch(`http://localhost:8080/api/notifications/user/${u.id}`)
      .then((res) => res.json())
      .then(setNotifications)
      .catch(() => alert("Failed to load notifications"));
  }, []);

  return (
    <div className="patient-layout">
      <AdminSidebar />

      <div className="content-area">
        <PatientHeader user={admin} />

        <main className="patient-content">
          <h2 className="page-title">Admin Notifications</h2>

          {notifications.length === 0 ? (
            <p className="empty-text">No notifications.</p>
          ) : (
            <div className="notification-list">
              {notifications
                .sort(
                  (a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                )
                .map((n) => (
                  <div
                    key={n.id}
                    className={`notification-card ${
                      !n.readStatus ? "unread" : ""
                    }`}
                  >
                    <strong>{n.message}</strong>

                    <span className="notif-time">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>

                    <span className="notif-status">
                      Status: {n.readStatus ? "Read" : "Unread"}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
