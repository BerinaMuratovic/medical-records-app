import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../services/api";
import "../../style.css";

export default function AdminHome() {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [range, setRange] = useState(30);
  const [stats, setStats] = useState({
    newUsers: 0,
    appointments: 0,
    userGrowth: 0,
  });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setAdmin(u);

    api.get("/users").then(res => setUsers(res.data));
    api.get("/appointments").then(res => setAppointments(res.data));
  }, []);

  useEffect(() => {
    api
      .get(`/admin/stats?days=${range}`)
      .then(res => setStats(res.data))
      .catch(() => console.error("Failed to load stats"));
  }, [range]);

  const doctors = users.filter(u => u.role === "DOCTOR").length;
  const patients = users.filter(u => u.role === "PATIENT").length;

  return (
    <div className="patient-layout">
      <AdminSidebar />

      <div className="content-area">
        <PatientHeader user={admin} />

        <main className="patient-content">
          <h2 className="dashboard-title">Admin Dashboard</h2>

          <div className="summary-grid">
            <div className="summary-card"><h3>Total Users</h3><p>{users.length}</p></div>
            <div className="summary-card"><h3>Doctors</h3><p>{doctors}</p></div>
            <div className="summary-card"><h3>Patients</h3><p>{patients}</p></div>
            <div className="summary-card"><h3>Total Appointments</h3><p>{appointments.length}</p></div>
          </div>

          <div className="stats-header">
            <h3>Platform Statistics</h3>
            <select
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="filter-select"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>

          <div className="summary-grid">
            <div className="summary-card highlight">
              <h4>New Users</h4>
              <p>{stats.newUsers}</p>
            </div>
            <div className="summary-card highlight">
              <h4>Appointments</h4>
              <p>{stats.appointments}</p>
            </div>
            <div className="summary-card highlight">
              <h4>User Growth</h4>
              <p className={stats.userGrowth >= 0 ? "growth-up" : "growth-down"}>
                {stats.userGrowth >= 0 ? "▲" : "▼"} {Math.abs(stats.userGrowth)}%
              </p>
            </div>
          </div>

          <h3 style={{ marginTop: "40px" }}>Recent Users</h3>
          <div className="record-card">
            {users.slice(0, 5).map(u => (
              <div key={u.id} className="record-item">
                <strong>{u.name}</strong>
                <span>{u.email}</span>
                <span>{u.role}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
