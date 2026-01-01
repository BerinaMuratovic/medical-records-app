import React, { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import PatientHeader from "../../components/PatientHeader";
import "../../style.css";

export default function DoctorNotifications() {
  const [doctor, setDoctor] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setDoctor(u);

    if (!u) return;

    fetch(`http://localhost:8080/api/notifications/user/${u.id}`)
      .then((res) => res.json())
      .then(setNotifications)
      .catch(() => alert("Failed to load notifications"));
  }, []);

  return (
    <div className="patient-layout">
      <DoctorSidebar />

      <div className="content-area">
        <PatientHeader user={doctor} />

        <main className="patient-content">
          <h2 className="page-title">Notifications</h2>

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
