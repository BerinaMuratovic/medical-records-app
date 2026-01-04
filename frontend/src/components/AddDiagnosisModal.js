import React, { useState } from "react";
import api from "../api";
import "../style.css";

export default function AddDiagnosisModal({
  patientId,
  doctorId,
  onClose,
  onSuccess,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MILD");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title || !description || !date) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      await api.post("/diagnoses", {
        title,
        description,
        severity,
        date,
        notes,
        patient: { id: patientId },
        doctor: { id: doctorId },
      });

      onSuccess && onSuccess();
      onClose();
    } catch {
      setError("Failed to save diagnosis.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Add Diagnosis</h3>

        {error && <div className="message-box error">{error}</div>}

        <label>Diagnosis Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Severity</label>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="MILD">Mild</option>
          <option value="MODERATE">Moderate</option>
          <option value="SEVERE">Severe</option>
        </select>

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Doctor Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className="modal-btn-row">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
