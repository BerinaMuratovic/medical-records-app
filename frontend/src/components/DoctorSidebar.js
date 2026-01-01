import React from "react";
import { NavLink } from "react-router-dom";
import "../style.css";

export default function DoctorSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">MediCorp</div>

      <nav className="sidebar-menu">
        <NavLink to="/doctor-dashboard" className="sidebar-link">
          Dashboard
        </NavLink>

        <NavLink to="/doctor/appointments" className="sidebar-link">
          Appointments
        </NavLink>

        {}
        <NavLink to="/doctor/patients" className="sidebar-link">
          Patients
        </NavLink>

        <NavLink to="/doctor/profile" className="sidebar-link">
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}
