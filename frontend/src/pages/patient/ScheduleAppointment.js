import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";
import PatientSidebar from "../../components/PatientSidebar";
import api from "../../api";
import "../../style.css";

export default function ScheduleAppointment() {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    api.get("/users")
      .then(res =>
        setDoctors(res.data.filter(u => u.role === "DOCTOR"))
      );

    if (u?.id) {
      api.get(`/appointments/patient/${u.id}`)
        .then(res =>
          setUpcoming(
            res.data.sort((a, b) => new Date(a.date) - new Date(b.date))
          )
        );
    }
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

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

      setSuccessMsg("Appointment scheduled successfully.");

      setUpcoming(prev =>
        [...prev, res.data].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      );

      setDate("");
      setReason("");
      setDoctorId("");
    } catch {
      setErrorMsg("Failed to schedule appointment.");
    }
  };

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <div className="content-area">
        <PatientHeader user={user} />

        {/* FORM */}
        <form onSubmit={handleSchedule}>
          {/* same JSX as before — unchanged */}
        </form>

        {/* AVAILABLE DOCTORS */}
        <div className="doctor-section">
          <h3>Available Doctors</h3>
          <div className="doctor-grid">
            {doctors.map(doc => (
              <div key={doc.id} className="doctor-card">
                <h4>{doc.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
