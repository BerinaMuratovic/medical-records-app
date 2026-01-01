import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";
import PatientSidebar from "../../components/PatientSidebar";
import "../../style.css";

export default function PatientRecords() {
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    if (!u) return;

    fetch(`http://localhost:8080/api/prescriptions/patient/${u.id}`)
      .then(res => res.json())
      .then(setPrescriptions);

    fetch(`http://localhost:8080/api/diagnoses/patient/${u.id}`)
      .then(res => res.json())
      .then(setDiagnoses);
  }, []);

  return (
    <div className="patient-layout">
      <PatientSidebar />

      <div className="content-area">
        <PatientHeader user={user} />

        <main className="patient-records-page">
          <h2 className="records-title">Medical Records</h2>

          {/* ================= PRESCRIPTIONS ================= */}
          <div className="record-card">
            <h3>Prescriptions</h3>

            {prescriptions.length === 0 ? (
              <p className="empty-message">No prescriptions found.</p>
            ) : (
              prescriptions.map((p) => (
                <div key={p.id} className="record-item">
                  <div className="record-left">
                    <strong className="record-name">
                      {p.medication?.name}
                    </strong>
                    <span className="record-detail">
                      {p.dosage} — {p.frequency}
                    </span>
                  </div>

                  <div className="record-right">
                    <span className="record-date">
                      {p.startDate} → {p.endDate}
                    </span>
                    <span className="record-doctor">
                      Dr. {p.prescribedBy?.name}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ================= DIAGNOSES ================= */}
          <div className="record-card">
            <h3>Diagnoses</h3>

            {diagnoses.length === 0 ? (
              <p className="empty-message">No diagnoses found.</p>
            ) : (
              diagnoses.map((d) => (
                <div
                  key={d.id}
                  className="record-item clickable"
                  onClick={() => setSelectedDiagnosis(d)}
                >
                  <div className="record-left">
                    <strong className="record-name">
                      {d.title}
                    </strong>
                    <span className="record-date">
                      {d.date}
                    </span>
                  </div>

                  <div className="record-right">
                    <span className={`severity-badge ${d.severity?.toLowerCase()}`}>
                      {d.severity}
                    </span>
                    <span className="record-doctor">
                      Dr. {d.doctor?.name}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* ================= DIAGNOSIS MODAL ================= */}
      {selectedDiagnosis && (
        <div className="modal-overlay">
          <div className="modal-card large">
            <h2 className="modal-title">
              {selectedDiagnosis.title}
            </h2>

            <p className="modal-subtitle">
              {selectedDiagnosis.date} • Dr. {selectedDiagnosis.doctor?.name}
            </p>

            <div className="modal-section">
              <strong>Severity</strong>
              <span className={`severity-badge ${selectedDiagnosis.severity?.toLowerCase()}`}>
                {selectedDiagnosis.severity}
              </span>
            </div>

            <div className="modal-section">
              <strong>Description</strong>
              <p>{selectedDiagnosis.description}</p>
            </div>

            {selectedDiagnosis.notes && (
              <div className="modal-section">
                <strong>Doctor Notes</strong>
                <p>{selectedDiagnosis.notes}</p>
              </div>
            )}

            <button
              className="primary-btn full-width"
              onClick={() => setSelectedDiagnosis(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
