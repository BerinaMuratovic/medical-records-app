import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "../../components/DoctorSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../services/api";
import "../../style.css";

export default function DoctorPatients() {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setDoctor(u);

    api.get("/users/role/PATIENT")
      .then(res => setPatients(res.data))
      .catch(() => console.error("Failed to load patients"));
  }, []);

  return (
    <div className="patient-layout">
      <DoctorSidebar />

      <div className="content-area">
        <PatientHeader user={doctor} />

        <main className="patient-content">
          <h2 style={{ marginLeft: "30px" }}>All Patients</h2>

          {patients.map(p => (
            <div
              key={p.id}
              className="patient-row"
              onClick={() => navigate(`/doctor/patients/${p.id}`)}
            >
              <div className="patient-info">
                <strong className="patient-name">{p.name}</strong>
              </div>

              <div className="patient-email">
                {p.email}
              </div>
            </div>
          ))}

          {patients.length === 0 && (
            <p style={{ marginLeft: 30, color: "#777" }}>
              No patients found.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
