import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./style.css";

/* ================= PUBLIC ================= */
import SignIn from "./components/SignIn";

/* ================= ADMIN ================= */
import AdminHome from "./pages/admin/AdminHome";
import AdminManageUsers from "./pages/admin/AdminManageUsers";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminNotifications from "./pages/admin/AdminNotifications";

/* ================= DOCTOR ================= */
import DoctorHome from "./pages/doctor/DoctorHome";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorPatientPage from "./pages/doctor/DoctorPatientPage";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorNotifications from "./pages/doctor/DoctorNotifications";

/* ================= PATIENT ================= */
import PatientHome from "./pages/patient/PatientHome";
import ScheduleAppointment from "./pages/patient/ScheduleAppointment";
import PatientRecords from "./pages/patient/PatientRecords";
import BloodworkPage from "./pages/patient/BloodworkPage";
import NotificationsPage from "./pages/patient/NotificationsPage";
import PatientProfile from "./pages/patient/PatientProfile";

/* ================= AI CHATBOT ================= */
import ChatBot from "./components/ChatBot";

function App() {
  const location = useLocation();
  const showTitle = location.pathname === "/";

  return (
    <div className="App">
      {showTitle && <h1 className="app-title">Medical Records App</h1>}

      <Routes>
        <Route path="/" element={<SignIn />} />

        {/* ADMIN */}
        <Route path="/admin-dashboard" element={<AdminHome />} />
        <Route path="/admin/users" element={<AdminManageUsers />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />

        {/* DOCTOR */}
        <Route path="/doctor-dashboard" element={<DoctorHome />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/patients" element={<DoctorPatients />} />
        <Route path="/doctor/patients/:patientId" element={<DoctorPatientPage />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/notifications" element={<DoctorNotifications />} />

        {/* PATIENT */}
        <Route path="/patient-dashboard" element={<PatientHome />} />
        <Route path="/patient/appointments" element={<ScheduleAppointment />} />
        <Route path="/patient/records" element={<PatientRecords />} />
        <Route path="/patient/bloodwork" element={<BloodworkPage />} />
        <Route path="/patient/notifications" element={<NotificationsPage />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
      </Routes>

      {}
      {!showTitle && <ChatBot />}
    </div>
  );
}

export default App;
