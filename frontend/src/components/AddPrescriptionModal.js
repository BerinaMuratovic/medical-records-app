import React, { useEffect, useState } from "react";
import api from "../api";

export default function AddPrescriptionModal({
  patientId,
  doctorId,
  onClose,
}) {
  const [medications, setMedications] = useState([]);
  const [form, setForm] = useState({
    medicationId: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/medications").then((res) => setMedications(res.data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () =>
    Object.values(form).every((v) => v !== "");

  const savePrescription = async () => {
    if (!validate()) {
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      await api.post("/prescriptions", {
        user: { id: patientId },
        prescribedBy: { id: doctorId },
        medication: { id: form.medicationId },
        dosage: form.dosage,
        frequency: form.frequency,
        startDate: form.startDate,
        endDate: form.endDate,
      });

      setStatus("success");
      setTimeout(onClose, 1200);
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3 className="modal-title">Add Medication</h3>

        <div className="modal-grid">
          <select name="medicationId" onChange={handleChange}>
            <option value="">Select medication</option>
            {medications.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <input name="dosage" placeholder="Dosage" onChange={handleChange} />
          <input name="frequency" placeholder="Frequency" onChange={handleChange} />
          <input type="date" name="startDate" onChange={handleChange} />
          <input type="date" name="endDate" onChange={handleChange} />
        </div>

        {status === "success" && (
          <p className="form-success">Medication prescribed successfully</p>
        )}
        {status === "error" && (
          <p className="form-error">Please complete all fields</p>
        )}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={loading} onClick={savePrescription}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
