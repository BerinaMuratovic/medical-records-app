import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";
import PatientSidebar from "../../components/PatientSidebar";
import api from "../../services/api";
import "../../style.css";

export default function BloodworkPage() {
  const [user, setUser] = useState(null);
  const [bloodwork, setBloodwork] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    if (!u?.id) return;

    api.get(`/bloodworks/user/${u.id}`)
      .then(res => {
        const clean = res.data.filter(b => b.user !== null);
        setBloodwork(clean);
      })
      .catch(err =>
        console.error("Failed to load bloodwork:", err)
      );
  }, []);

  return (
    <div className="patient-layout">
      <PatientSidebar />

      <div className="content-area">
        <PatientHeader user={user} />

        <main className="patient-content bloodwork-page">
          <h2 className="bloodwork-title">🩸 Bloodwork History</h2>
          <p className="dashboard-subtitle">
            Review your past laboratory test results
          </p>

          {bloodwork.length === 0 && (
            <p className="empty-message">
              No bloodwork records found.
            </p>
          )}

          {bloodwork.map(b => (
            <div key={b.id} className="bloodwork-entry">
              {/* DATE */}
              <strong className="bloodwork-date">
                📅 Test Date: {b.testDate}
              </strong>

              {/* RESULTS */}
              <div className="bloodwork-group">

                <div className="blood-item">
                  <label>🧲 Iron: {b.ironLevel}</label>
                  <input
                    type="range"
                    value={b.ironLevel}
                    min="20"
                    max="200"
                    readOnly
                  />
                </div>

                <div className="blood-item">
                  <label>🍬 Glucose: {b.glucoseLevel}</label>
                  <input
                    type="range"
                    value={b.glucoseLevel}
                    min="50"
                    max="250"
                    readOnly
                  />
                </div>

                <div className="blood-item">
                  <label>🧈 Cholesterol: {b.cholesterolLevel}</label>
                  <input
                    type="range"
                    value={b.cholesterolLevel}
                    min="100"
                    max="350"
                    readOnly
                  />
                </div>

                <div className="blood-item">
                  <label>❤️ Hemoglobin: {b.hemoglobinLevel}</label>
                  <input
                    type="range"
                    value={b.hemoglobinLevel}
                    min="5"
                    max="20"
                    readOnly
                  />
                </div>

              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
