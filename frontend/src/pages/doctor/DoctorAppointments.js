import React, { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";

import PatientHeader from "../../components/PatientHeader.js";

export default function DoctorAppointments() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    fetch(`http://localhost:8080/api/appointments/doctor/${u.id}`)
      .then(res => res.json())
      .then(setAppointments);
  }, []);

  return (
    <div className="patient-layout">
      <DoctorSidebar />
      <div className="content-area">
        <PatientHeader user={user} />

        <main className="patient-content">
          <h2>Upcoming Appointments</h2>

          {appointments.map(a => (
            <div key={a.id} className="upcoming-card">
              <strong>{new Date(a.date).toLocaleString()}</strong>
              <span>Patient: {a.patient?.name}</span>
              <span>Status: {a.status}</span>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
