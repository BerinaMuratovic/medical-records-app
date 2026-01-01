import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DoctorSidebar from "../../components/DoctorSidebar";
import PatientHeader from "../../components/PatientHeader";
import AddBloodworkModal from "../../components/AddBloodworkModal";
import AddDiagnosisModal from "../../components/AddDiagnosisModal";
import AddPrescriptionModal from "../../components/AddPrescriptionModal";

import "../../style.css";

export default function DoctorPatientPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("bloodwork");

  const [showBloodworkModal, setShowBloodworkModal] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const loggedDoctor = JSON.parse(localStorage.getItem("user"));
    setDoctor(loggedDoctor);

    fetch(`http://localhost:8080/api/users/${patientId}`)
      .then((res) => res.json())
      .then(setPatient)
      .catch(() => alert("Failed to load patient"));
  }, [patientId]);

  if (!patient || !doctor) {
    return <p style={{ padding: "2rem" }}>Loading patient...</p>;
  }

  return (
    <div className="patient-layout">
      <DoctorSidebar />

      <div className="content-area">
        <PatientHeader user={doctor} />

        <main className="patient-content">

          {/* ===== BACK BUTTON ===== */}
          <button
            onClick={() => navigate("/doctor/patients")}
            className="back-btn"
          >
            ← Back to Patients
          </button>

          {/* ===== PATIENT SUMMARY ===== */}
          <div className="patient-summary-card">
            <div className="patient-summary-main">

              <div className="patient-summary-left">
                <h2 className="patient-name-big">{patient.name}</h2>
                <p className="patient-email">{patient.email}</p>
              </div>

              <div className="patient-summary-divider" />

              <div className="patient-summary-right">
                <span><strong>ID:</strong> {patient.id}</span>
                <span><strong>Role:</strong> {patient.role}</span>
              </div>

            </div>
          </div>

          {/* ===== TABS ===== */}
          <div className="doctor-tabs">
            <button
              className={activeTab === "bloodwork" ? "tab active" : "tab"}
              onClick={() => setActiveTab("bloodwork")}
            >
              🩸 Bloodwork
            </button>

            <button
              className={activeTab === "diagnosis" ? "tab active" : "tab"}
              onClick={() => setActiveTab("diagnosis")}
            >
              🩺 Diagnoses
            </button>

            <button
              className={activeTab === "medication" ? "tab active" : "tab"}
              onClick={() => setActiveTab("medication")}
            >
              💊 Medications
            </button>
          </div>

          {/* ===== TAB CONTENT ===== */}
          <div className="tab-content">

            {/* ---- BLOODWORK ---- */}
            {activeTab === "bloodwork" && (
              <div className="tab-panel">
                <h3>Bloodwork Records</h3>
                <p className="tab-hint">
                  Add and review laboratory results for this patient.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => setShowBloodworkModal(true)}
                >
                  + Add Bloodwork
                </button>
              </div>
            )}

            {/* ---- DIAGNOSIS ---- */}
            {activeTab === "diagnosis" && (
              <div className="tab-panel">
                <h3>Diagnoses</h3>
                <p className="tab-hint">
                  Record medical diagnoses for this patient.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => setShowDiagnosisModal(true)}
                >
                  + Add Diagnosis
                </button>
              </div>
            )}

            {/* ---- MEDICATION ---- */}
            {activeTab === "medication" && (
              <div className="tab-panel">
                <h3>Medications</h3>
                <p className="tab-hint">
                  Prescribe and manage medications.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => setShowPrescriptionModal(true)}
                >
                  + Add Medication
                </button>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ===== MODALS ===== */}
      {showBloodworkModal && (
        <AddBloodworkModal
          patientId={patient.id}
          onClose={() => setShowBloodworkModal(false)}
          onSuccess={() => {}}
        />
      )}

      {showDiagnosisModal && (
        <AddDiagnosisModal
          patientId={patient.id}
          doctorId={doctor.id}
          onClose={() => setShowDiagnosisModal(false)}
          onSuccess={() => {}}
        />
      )}

      {showPrescriptionModal && (
        <AddPrescriptionModal
          patientId={patient.id}
          doctorId={doctor.id}
          onClose={() => setShowPrescriptionModal(false)}
        />
      )}
    </div>
  );
}
