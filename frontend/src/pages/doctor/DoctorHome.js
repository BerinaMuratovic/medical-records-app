import React, { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import PatientHeader from "../../components/PatientHeader";
import "../../style.css";

export default function DoctorHome() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [recentDiagnosis, setRecentDiagnosis] = useState(null);

  useEffect(() => {
    const d = JSON.parse(localStorage.getItem("user"));
    setDoctor(d);

    if (!d?.id) return;

    // Next appointments
    fetch(`http://localhost:8080/api/appointments/doctor/${d.id}`)
      .then(res => res.json())
      .then(data => setAppointments(data));

    // Patients count
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(users => {
        const patients = users.filter(u => u.role === "PATIENT");
        setPatientsCount(patients.length);
      });

    // Recent diagnosis by doctor
    fetch(`http://localhost:8080/api/diagnoses/doctor/${d.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const sorted = data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setRecentDiagnosis(sorted[0]);
        }
      });
  }, []);

  const upcoming =
    appointments.length > 0
      ? appointments.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )[0]
      : null;

  return (
    <div className="patient-layout">
      <DoctorSidebar />

      <div className="content-area">
        <PatientHeader user={doctor} />

        <main className="dashboard-main">
          <h2 className="dashboard-title">
            Welcome, Dr. {doctor?.name} 👋
          </h2>
          <p className="dashboard-subtitle">
            View your appointments, patients, and recent medical activity.
          </p>

          <div className="summary-grid">

            {/* NEXT APPOINTMENT */}
            <div className="summary-card">
              <div className="card-icon">📅</div>
              <h3>Next Appointment</h3>
              {upcoming ? (
                <p>
                  {new Date(upcoming.date).toLocaleString()} <br />
                  Patient: {upcoming.patient?.name}
                </p>
              ) : (
                <p>No upcoming appointments</p>
              )}
            </div>

            {/* PATIENT COUNT */}
            <div className="summary-card">
              <div className="card-icon">👥</div>
              <h3>Total Patients</h3>
              <p>{patientsCount}</p>
            </div>

            {/* RECENT DIAGNOSIS */}
            <div className="summary-card">
              <div className="card-icon">🩺</div>
              <h3>Recent Diagnosis</h3>
              {recentDiagnosis ? (
                <p>
                  {recentDiagnosis.description} <br />
                  {recentDiagnosis.date}
                </p>
              ) : (
                <p>No diagnoses yet</p>
              )}
            </div>

            {/* QUICK ACTION */}
            <div className="summary-card">
  <div className="card-icon">⚡</div>
  <h3>Quick Actions</h3>

  <div className="quick-actions">
    <button
      className="quick-btn"
      onClick={() => window.location.href = "/doctor/patients"}
    >
      👥 View Patients
    </button>

    <button
      className="quick-btn"
      onClick={() => window.location.href = "/doctor/appointments"}
    >
      📅 View Appointments
    </button>
  </div>
</div>


          </div>
        </main>
      </div>
    </div>
  );
}
