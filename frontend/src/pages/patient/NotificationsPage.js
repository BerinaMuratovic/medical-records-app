import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";

export default function NotificationsPage() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    fetch(`http://localhost:8080/api/notifications/user/${u.id}`)
      .then(res => res.json())
      .then(setNotifications);
  }, []);

  return (
    <div className="patient-home">
      <PatientHeader user={user} />

      <main className="patient-content">
        <h2>Notifications</h2>

        {notifications
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(n => (
            <div key={n.id} className={`medication-item ${!n.readStatus ? "unread" : ""}`}>
              <strong>{n.message}</strong>
              <span>{new Date(n.createdAt).toLocaleString()}</span>
              <span>Status: {n.readStatus ? "Read" : "Unread"}</span>
            </div>
          ))}
      </main>
    </div>
  );
}
