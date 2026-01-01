import { NavLink } from "react-router-dom";
import "../style.css";

export default function AdminSidebar() {
  return (
    <aside className="sidebar">
  <h2 className="sidebar-logo">MediCorp</h2>

  <nav className="sidebar-menu">
    <NavLink to="/admin-dashboard" className="sidebar-link">
      Dashboard
    </NavLink>

    <NavLink to="/admin/users" className="sidebar-link">
      Manage Users
    </NavLink>

    <NavLink to="/admin/profile" className="sidebar-link">
      Profile
    </NavLink>
  </nav>
</aside>

  );
}
