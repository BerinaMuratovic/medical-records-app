import React, { useEffect, useState } from "react";
import PatientSidebar from "../../components/PatientSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../services/api";
import "../../style.css";

export default function PatientHome() {
  const [user, setUser] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [recentDiagnosis, setRecentDiagnosis] = useState(null);
  const [recentBloodwork, setRecentBloodwork] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    if (!u?.id) return;

    api.get(`/appointments/patient/${u.id}`).then(res => {
      if (res.data.length)
        setNextAppointment(res.data.sort((a,b)=>new Date(a.date)-new Date(b.date))[0]);
    });

    api.get(`/diagnoses/patient/${u.id}`).then(res => {
      if (res.data.length)
        setRecentDiagnosis(res.data.sort((a,b)=>new Date(b.date)-new Date(a.date))[0]);
    });

    api.get(`/bloodworks/user/${u.id}`).then(res => {
      if (res.data.length)
        setRecentBloodwork(res.data[res.data.length - 1]);
    });

    api.get(`/notifications/user/${u.id}`).then(res => {
      setUnreadCount(res.data.filter(n => !n.readStatus).length);
    });
  }, []);

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <div className="content-area">
        <PatientHeader user={user} unreadCount={unreadCount} />

        <main className="dashboard-main">
          <h2>Welcome, {user?.name}</h2>
          <p>Next appointment: {nextAppointment?.date || "None"}</p>
          <p>Recent diagnosis: {recentDiagnosis?.title || "None"}</p>
          <p>Unread notifications: {unreadCount}</p>
        </main>
      </div>
    </div>
  );
}
