import React, { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../api";
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

    api.get(`/appointments/doctor/${d.id}`)
      .then(res => setAppointments(res.data));

 
    api.get("/users/role/PATIENT")
      .then(res => setPatientsCount(res.data.length));

    api.get(`/diagnoses/doctor/${d.id}`)
      .then(res => {
        if (res.data.length > 0) {
          const sorted = res.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setRecentDiagnosis(sorted[0]);
        }
      });
  }, []);

  const upcoming =
    appointments.length > 0
      ? appointments.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
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

          <div className="summary-grid">

            <div className="summary-card">
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

            <div className="summary-card">
              <h3>Total Patients</h3>
              <p>{patientsCount}</p>
            </div>

            <div className="summary-card">
              <h3>Recent Diagnosis</h3>
              {recentDiagnosis ? (
                <p>{recentDiagnosis.description}</p>
              ) : (
                <p>No diagnoses yet</p>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
