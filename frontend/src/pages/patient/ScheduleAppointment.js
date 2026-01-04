import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";
import PatientSidebar from "../../components/PatientSidebar";
import api from "../../services/api";
import "../../style.css";

export default function ScheduleAppointment() {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);

  const [, setUpcoming] = useState([]); 
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    api.get("/users").then(res => {
      setDoctors(res.data.filter(u => u.role === "DOCTOR"));
    });

    if (u?.id) {
      api.get(`/appointments/patient/${u.id}`).then(res => {
        setUpcoming(
          res.data.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )
        );
      });
    }
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!doctorId || !date || !reason) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    try {
      const res = await api.post("/appointments", {
        date,
        reason,
        status: "PENDING",
        patient: { id: user.id },
        doctor: { id: doctorId },
      });

      setSuccessMsg(
        "✅ Appointment scheduled successfully. Your doctor will be notified."
      );

      setUpcoming(prev =>
        [...prev, res.data].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      );

      setDate("");
      setReason("");
      setDoctorId("");
    } catch {
      setErrorMsg("❌ Failed to schedule appointment. Please try again.");
    }
  };

  return (
    <div className="patient-layout">
      <PatientSidebar />

      <div className="content-area">
        <PatientHeader user={user} />

        <div className="appointment-wrapper">
          <div className="appointment-card">

            {/* ILLUSTRATION */}
            <div className="appointment-illustration">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png"
                alt="appointment"
                style={{ width: "260px" }}
              />
            </div>

            {/* FORM */}
            <div className="appointment-form">
              <h2>📅 Schedule Appointment</h2>
              <p>Book an appointment with your preferred doctor.</p>

              {successMsg && (
                <div className="form-success">{successMsg}</div>
              )}
              {errorMsg && (
                <div className="form-error">{errorMsg}</div>
              )}

              <form onSubmit={handleSchedule}>
                <div className="form-group">
                  <label>Date & Time</label>
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <input
                    type="text"
                    placeholder="Describe your reason for visit"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Doctor</label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn schedule-btn">
                  Schedule
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* AVAILABLE DOCTORS */}
        <div className="doctor-section">
          <h3>👩‍⚕️ Available Doctors</h3>

          <div className="doctor-grid">
            {doctors.map(doc => (
              <div className="doctor-card" key={doc.id}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3870/3870822.png"
                  alt="doctor"
                  className="doctor-img"
                />
                <h4>{doc.name}</h4>
                <p className="doctor-specialty">
                  {doc.specialty || "General Medicine"}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
