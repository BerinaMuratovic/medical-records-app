import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import PatientHeader from "../../components/PatientHeader";
import "../../style.css";

export default function AdminManageUsers() {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setAdmin(u);
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setErrorMsg(" Failed to load users."));
  };

  /* ================= CHANGE ROLE ================= */

  const changeRole = async (userId, newRole) => {
    setSuccessMsg("");
    setErrorMsg("");

    const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      setSuccessMsg(" User role updated successfully.");
      fetchUsers();
    } else {
      setErrorMsg(" Failed to update role.");
    }
  };

  /* ================= DELETE USER ================= */

  const confirmDelete = (user) => {
    setDeleteTarget(user);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSuccessMsg("");
    setErrorMsg("");

    const res = await fetch(
      `http://localhost:8080/api/users/${deleteTarget.id}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      setSuccessMsg(" User deleted successfully.");
      fetchUsers();
    } else {
      setErrorMsg(" Failed to delete user.");
    }

    setDeleteTarget(null);
  };

  return (
    <div className="patient-layout">
      <AdminSidebar />

      <div className="content-area">
        <PatientHeader user={admin} />

        <main className="patient-content">
          <h2 className="page-title">Manage Users</h2>
          <p className="page-subtitle">
            Modify user roles or remove users from the system.
          </p>

          {/* ===== FEEDBACK ===== */}
          {successMsg && (
            <div className="message-box success">{successMsg}</div>
          )}
          {errorMsg && (
            <div className="message-box error">{errorMsg}</div>
          )}

          <div className="record-card">
            {users.map((u) => (
              <div key={u.id} className="record-item admin-user-item">
                <div className="record-left">
                  <strong>{u.name}</strong>
                  <span>{u.email}</span>
                </div>

                <div className="record-right admin-actions">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="PATIENT">PATIENT</option>
                    <option value="DOCTOR">DOCTOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>

                  <button
                    className="danger-btn"
                    onClick={() => confirmDelete(u)}
                    disabled={u.role === "ADMIN"}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>?
            </p>
            <p className="warning-text">
              This action cannot be undone.
            </p>

            <div className="modal-btn-row">
              <button
                className="cancel-btn"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button className="danger-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
