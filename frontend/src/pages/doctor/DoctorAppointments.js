import React, { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../services/api";
import "../../style.css";

export default function DoctorAppointments() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u?.id) return;

    setDoctor(u);

    api.get(`/appointments/doctor/${u.id}`)
      .then(res => setAppointments(res.data))
      .catch(() => {});
  }, []);

  if (!doctor) return null;

  return (
    <div className="patient-layout">
      <DoctorSidebar />

      <div className="content-area">
        <PatientHeader user={doctor} />

        <main className="patient-content">
          <h2>Upcoming Appointments</h2>

          {appointments.length === 0 && (
            <p>No appointments.</p>
          )}

          {appointments.map(a => (
            <div key={a.id} className="upcoming-card">
              <strong>
                {new Date(a.date).toLocaleString()}
              </strong>
              <span>Patient: {a.patient?.name}</span>
              <span>Status: {a.status}</span>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
