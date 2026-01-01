import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

export default function PatientHeader({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  /* ================= ROUTES ================= */
  const getDashboardRoute = () => {
    if (!user) return "/";
    if (user.role === "ADMIN") return "/admin-dashboard";
    if (user.role === "DOCTOR") return "/doctor-dashboard";
    return "/patient-dashboard";
  };

  const getProfileRoute = () => {
    if (!user) return "/";
    if (user.role === "ADMIN") return "/admin/profile";
    if (user.role === "DOCTOR") return "/doctor/profile";
    return "/patient-profile";
  };

  /* ================= LOGOUT ================= */
  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // ensures clean state
  };

  /* ================= FETCH NOTIFICATIONS ================= */
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8080/api/notifications/user/${user.id}`)
      .then((res) => res.json())
      .then(setNotifications)
      .catch(() => {});
  }, [user]);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <header className="patient-header">
      {/* LOGO */}
      <div
        className="logo"
        onClick={() => navigate(getDashboardRoute())}
      >
        
      </div>

      <div className="header-right">
        {/* NOTIFICATIONS */}
        <div className="notif-wrapper" ref={dropdownRef}>
          <button
            className="notif-btn"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            🔔
            {notifications.some((n) => !n.readStatus) && (
              <span className="notif-dot"></span>
            )}
          </button>

          {open && (
            <div className="notif-dropdown">
              <h4>Notifications</h4>

              {notifications.length === 0 ? (
                <p className="notif-empty">No notifications.</p>
              ) : (
                <ul>
                  {notifications
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((n) => (
                      <li
                        key={n.id}
                        className={`notif-item ${
                          !n.readStatus ? "unread" : ""
                        }`}
                      >
                        <strong>{n.message}</strong>
                        <span>
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div
          className="user-box"
          onClick={() => navigate(getProfileRoute())}
        >
          <span>{user.name}</span>
          <img
            src={
              user.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="profile"
            className="profile-pic"
          />
        </div>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={logoutHandler}>
          Logout
        </button>
      </div>
    </header>
  );
}
