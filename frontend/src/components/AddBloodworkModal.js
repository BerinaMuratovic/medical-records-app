import React, { useState } from "react";

export default function AddBloodworkModal({
  patientId,
  onClose,
  onSuccess
}) {
  const [form, setForm] = useState({
    testDate: "",
    ironLevel: "",
    glucoseLevel: "",
    cholesterolLevel: "",
    hemoglobinLevel: ""
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    return Object.values(form).every(v => v !== "");
  };

  const saveBloodwork = async () => {
    if (!validate()) {
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:8080/api/bloodworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          user: { id: patientId }
        })
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      onSuccess();
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
        <h3 className="modal-title">Add Bloodwork</h3>

        <div className="modal-grid">
          <input type="date" name="testDate" onChange={handleChange} />
          <input name="ironLevel" placeholder="Iron level" onChange={handleChange} />
          <input name="glucoseLevel" placeholder="Glucose level" onChange={handleChange} />
          <input name="cholesterolLevel" placeholder="Cholesterol level" onChange={handleChange} />
          <input name="hemoglobinLevel" placeholder="Hemoglobin level" onChange={handleChange} />
        </div>

        {status === "success" && (
          <p className="form-success"> Bloodwork added successfully</p>
        )}

        {status === "error" && (
          <p className="form-error"> Please fill in all fields</p>
        )}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={loading} onClick={saveBloodwork}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
