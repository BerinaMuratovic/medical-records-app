import React, { useEffect, useState } from "react";
import PatientSidebar from "../../components/PatientSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../services/api";
import "../../style.css";

export default function PatientHome() {
  const [user, setUser] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [recentDiagnosis, setRecentDiagnosis] = useState(null);
  const [, setRecentBloodwork] = useState(null); 
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u?.id) return;

    setUser(u);

    api.get(`/appointments/patient/${u.id}`).then(res => {
      if (res.data.length) {
        setNextAppointment(
          res.data.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )[0]
        );
      }
    });

    api.get(`/diagnoses/patient/${u.id}`).then(res => {
      if (res.data.length) {
        setRecentDiagnosis(
          res.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )[0]
        );
      }
    });

    api.get(`/bloodworks/user/${u.id}`).then(res => {
      if (res.data.length) {
        setRecentBloodwork(res.data[res.data.length - 1]);
      }
    });

    api.get(`/notifications/user/${u.id}`).then(res => {
      setUnreadCount(res.data.filter(n => !n.readStatus).length);
    });
  }, []);

  if (!user) return null;

  return (
    <div className="patient-layout">
      <PatientSidebar />

      <div className="content-area">
        <PatientHeader user={user} unreadCount={unreadCount} />

        <main className="dashboard-main">
          <h2 className="dashboard-title">
            Welcome, {user.name} 👋
          </h2>
          <p className="dashboard-subtitle">
            Here is your health summary:
          </p>

          <div className="summary-grid">

            {/* NEXT APPOINTMENT */}
            <div className="summary-card">
              <div className="card-icon">📅</div>
              <h3>Next Appointment</h3>
              {nextAppointment ? (
                <p>
                  {new Date(nextAppointment.date).toLocaleString()} <br />
                  With Dr. {nextAppointment.doctor?.name}
                </p>
              ) : (
                <p>No upcoming appointment</p>
              )}
            </div>

            {/* RECENT DIAGNOSIS */}
            <div className="summary-card">
              <div className="card-icon">🩺</div>
              <h3>Recent Diagnosis</h3>
              {recentDiagnosis ? (
                <p>
                  {recentDiagnosis.title} <br />
                  By Dr. {recentDiagnosis.doctor?.name}
                </p>
              ) : (
                <p>No recent diagnoses</p>
              )}
            </div>

            {/* BLOODWORK */}
            <div className="summary-card">
              <div className="card-icon">🧪</div>
              <h3>Bloodwork Status</h3>
              <p>View latest test results</p>
            </div>

            {/* NOTIFICATIONS */}
            <div className="summary-card">
              <div className="card-icon">🔔</div>
              <h3>Notifications</h3>
              <p>{unreadCount} unread</p>
            </div>

          </div>
        </main>

        <footer className="patient-footer">
          © 2025 Medical Records App
        </footer>
      </div>
    </div>
  );
}
