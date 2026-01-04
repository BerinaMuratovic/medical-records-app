import React, { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../api";

export default function DoctorNotifications() {
  const [doctor, setDoctor] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setDoctor(u);
    if (!u) return;

    api.get(`/notifications/user/${u.id}`)
      .then(res => setNotifications(res.data));
  }, []);

  return (
    <div className="patient-layout">
      <DoctorSidebar />
      <div className="content-area">
        <PatientHeader user={doctor} />

        <main className="patient-content">
          <h2>Notifications</h2>

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
