import React, { useState } from "react";
import "../style.css";

export default function AddDiagnosisModal({
  patientId,
  doctorId,
  onClose,
  onSuccess
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

    const diagnosis = {
      title,
      description,
      severity,
      date,
      notes,
      patient: { id: patientId },
      doctor: { id: doctorId }
    };

    const res = await fetch("http://localhost:8080/api/diagnoses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(diagnosis)
    });

    if (res.ok) {
      onSuccess && onSuccess();
      onClose();
    } else {
      setError("Failed to save diagnosis.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Add Diagnosis</h3>

        {error && <div className="message-box error">{error}</div>}

        <label>Diagnosis Title</label>
        <input
          placeholder="e.g. Common Cold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Severity</label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="MILD">Mild</option>
          <option value="MODERATE">Moderate</option>
          <option value="SEVERE">Severe</option>
        </select>

        <label>Description</label>
        <textarea
          rows="4"
          placeholder="Detailed diagnosis description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Doctor Notes (optional)</label>
        <textarea
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="modal-btn-row">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
