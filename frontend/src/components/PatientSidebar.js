import React from "react";
import { NavLink } from "react-router-dom";
import "../style.css";

export default function PatientSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">MediCorp</div>

      <nav className="sidebar-menu">
        <NavLink to="/patient-dashboard" className="sidebar-link">
          Dashboard
        </NavLink>

        <NavLink to="/patient/appointments" className="sidebar-link">
          Schedule Appointment
        </NavLink>

        <NavLink to="/patient/records" className="sidebar-link">
          Medical Records
        </NavLink>

        <NavLink to="/patient/bloodwork" className="sidebar-link">
          Bloodwork
        </NavLink>

        
      </nav>
    </aside>
  );
}
