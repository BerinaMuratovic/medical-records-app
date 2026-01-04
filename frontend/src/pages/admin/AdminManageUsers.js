import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../services/api";
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
    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => setErrorMsg("Failed to load users."));
  };

  const changeRole = async (userId, newRole) => {
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await api.put(`/users/${userId}`, { role: newRole });
      setSuccessMsg("User role updated.");
      fetchUsers();
    } catch {
      setErrorMsg("Failed to update role.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      setSuccessMsg("User deleted.");
      fetchUsers();
    } catch {
      setErrorMsg("Failed to delete user.");
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

          {successMsg && <div className="message-box success">{successMsg}</div>}
          {errorMsg && <div className="message-box error">{errorMsg}</div>}

          <div className="record-card">
            {users.map(u => (
              <div key={u.id} className="record-item admin-user-item">
                <strong>{u.name}</strong>
                <span>{u.email}</span>

                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  <option value="PATIENT">PATIENT</option>
                  <option value="DOCTOR">DOCTOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

                <button
                  className="danger-btn"
                  onClick={() => setDeleteTarget(u)}
                  disabled={u.role === "ADMIN"}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-card">
            <p>Delete {deleteTarget.name}?</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={() => setDeleteTarget(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
