import React, { useEffect, useState } from "react";

export default function AddPrescriptionModal({
  patientId,
  doctorId,
  onClose
}) {
  const [medications, setMedications] = useState([]);
  const [form, setForm] = useState({
    medicationId: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: ""
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/medications")
      .then(res => res.json())
      .then(setMedications);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    return Object.values(form).every(v => v !== "");
  };

  const savePrescription = async () => {
    if (!validate()) {
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:8080/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { id: patientId },
          prescribedBy: { id: doctorId },
          medication: { id: form.medicationId },
          dosage: form.dosage,
          frequency: form.frequency,
          startDate: form.startDate,
          endDate: form.endDate
        })
      });

      if (!res.ok) throw new Error();

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
            {medications.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <input name="dosage" placeholder="Dosage" onChange={handleChange} />
          <input name="frequency" placeholder="Frequency" onChange={handleChange} />
          <input type="date" name="startDate" onChange={handleChange} />
          <input type="date" name="endDate" onChange={handleChange} />
        </div>

        {status === "success" && (
          <p className="form-success"> Medication prescribed successfully</p>
        )}

        {status === "error" && (
          <p className="form-error"> Please complete all fields</p>
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
