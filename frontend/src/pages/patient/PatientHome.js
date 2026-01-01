import React, { useEffect, useState } from "react";
import PatientSidebar from "../../components/PatientSidebar";
import PatientHeader from "../../components/PatientHeader";
import "../../style.css";

export default function PatientHome() {
  const [user, setUser] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [recentDiagnosis, setRecentDiagnosis] = useState(null);
  const [recentBloodwork, setRecentBloodwork] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      fetchDashboardData(u.id);
    }
  }, []);

  const fetchDashboardData = async (userId) => {
    try {
      //Fetch appointments
      const apptRes = await fetch(`http://localhost:8080/api/appointments/patient/${userId}`);
      const appts = await apptRes.json();
      if (appts.length > 0) {
        const sorted = appts.sort((a, b) => new Date(a.date) - new Date(b.date));
        setNextAppointment(sorted[0]);
      }

      // === Fetch diagnoses ===
      const diagRes = await fetch(`http://localhost:8080/api/diagnoses/patient/${userId}`);
      const diag = await diagRes.json();
      if (diag.length > 0) {
        const sorted = diag.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentDiagnosis(sorted[0]);
      }

      //Fetch bloodwork
      const bloodRes = await fetch(`http://localhost:8080/api/bloodworks/user/${userId}`);
      const blood = await bloodRes.json();
      if (blood.length > 0) {
        const sorted = blood.sort((a, b) => new Date(b.testDate) - new Date(a.testDate));
        setRecentBloodwork(sorted[sorted.length - 1]);
      }

      //Fetch notifications
      const notifRes = await fetch(`http://localhost:8080/api/notifications/user/${userId}`);
      const notif = await notifRes.json();
      const unread = notif.filter(n => !n.readStatus).length;
      setUnreadCount(unread);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  return (
    <div className="patient-layout">
      <PatientSidebar />

      <div className="content-area">
        <PatientHeader user={user} unreadCount={unreadCount} />

        <main className="dashboard-main">
          <h2 className="dashboard-title">
            Welcome, {user?.name} 👋
          </h2>
          <p className="dashboard-subtitle">Here is your health summary:</p>

          <div className="summary-grid">

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

            <div className="summary-card">
              <div className="card-icon">🩺</div>
              <h3>Recent Diagnosis</h3>
              {recentDiagnosis ? (
                <p>
                  {recentDiagnosis.description} <br />
                  By Dr. {recentDiagnosis.doctor?.name}
                </p>
              ) : (
                <p>No recent diagnoses.</p>
              )}
            </div>

            <div className="summary-card">
              <div className="card-icon">🧪</div>
              <h3>Bloodwork Status</h3>
              {recentBloodwork ? (
                <p>
                  Iron: {recentBloodwork.ironLevel} <br />
                  Glucose: {recentBloodwork.glucoseLevel}
                </p>
              ) : (
                <p>No recent blood tests.</p>
              )}
            </div>

            <div className="summary-card">
              <div className="card-icon">🔔</div>
              <h3>Notifications</h3>
              <p>{unreadCount} unread</p>
            </div>

          </div>
        </main>

        <footer className="patient-footer">© 2025 Medical Records App</footer>
      </div>
    </div>
  );
}
