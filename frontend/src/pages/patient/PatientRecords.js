import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";
import PatientSidebar from "../../components/PatientSidebar";
import api from "../../services/api";
import "../../style.css";

export default function PatientRecords() {
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    if (!u?.id) return;

    api.get(`/prescriptions/patient/${u.id}`)
      .then(res => setPrescriptions(res.data));

    api.get(`/diagnoses/patient/${u.id}`)
      .then(res => setDiagnoses(res.data));
  }, []);

  return (
    <div className="patient-layout">
      <PatientSidebar />

      <div className="content-area">
        <PatientHeader user={user} />

        <main className="patient-records-page">
          <h2 className="records-title">Medical Records</h2>

          {/* PRESCRIPTIONS */}
          <div className="record-card">
            <h3>Prescriptions</h3>

            {prescriptions.length === 0 ? (
              <p className="empty-message">No prescriptions found.</p>
            ) : (
              prescriptions.map(p => (
                <div key={p.id} className="record-item">
                  <div className="record-left">
                    <strong>{p.medication?.name}</strong>
                    <span>{p.dosage} — {p.frequency}</span>
                  </div>
                  <div className="record-right">
                    <span>{p.startDate} → {p.endDate}</span>
                    <span>Dr. {p.prescribedBy?.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DIAGNOSES */}
          <div className="record-card">
            <h3>Diagnoses</h3>

            {diagnoses.length === 0 ? (
              <p className="empty-message">No diagnoses found.</p>
            ) : (
              diagnoses.map(d => (
                <div
                  key={d.id}
                  className="record-item clickable"
                  onClick={() => setSelectedDiagnosis(d)}
                >
                  <div>
                    <strong>{d.title}</strong>
                    <span>{d.date}</span>
                  </div>
                  <div>
                    <span className={`severity-badge ${d.severity?.toLowerCase()}`}>
                      {d.severity}
                    </span>
                    <span>Dr. {d.doctor?.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {selectedDiagnosis && (
        <div className="modal-overlay">
          <div className="modal-card large">
            <h2>{selectedDiagnosis.title}</h2>
            <p>{selectedDiagnosis.date} • Dr. {selectedDiagnosis.doctor?.name}</p>
            <p>{selectedDiagnosis.description}</p>
            <button onClick={() => setSelectedDiagnosis(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
