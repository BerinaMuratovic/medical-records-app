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
          <h2 className="page-title">📅 Upcoming Appointments</h2>

          {appointments.length === 0 && (
            <p className="empty-text">No upcoming appointments.</p>
          )}

          <div className="appointments-list">
            {appointments.map(a => (
              <div key={a.id} className="appointment-card">
                <div className="appointment-left">
                  <div className="appointment-date">
                    📆 {new Date(a.date).toLocaleDateString()}
                  </div>
                  <div className="appointment-time">
                    ⏰ {new Date(a.date).toLocaleTimeString()}
                  </div>
                </div>

                <div className="appointment-middle">
                  <strong className="appointment-patient">
                    👤 {a.patient?.name}
                  </strong>
                </div>

                <div className="appointment-right">
                  <span className={`status-badge ${a.status?.toLowerCase()}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
