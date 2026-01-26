import React, { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../services/api";
import "../../style.css";

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) return;

    setDoctor(u);
    setName(u.name || "");
    setProfilePic(u.profilePic || "");
  }, []);

  const handleUpdate = async () => {
    if (!doctor) return;

    try {
      const res = await api.put(`/users/${doctor.id}`, {
        name,
        password: password.trim() === "" ? undefined : password,
        profilePic,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      setDoctor(res.data);
      setEditOpen(false);
      setPassword("");
    } catch {
      alert("Update failed");
    }
  };

  if (!doctor) return null;

  return (
    <div className="patient-layout">
      <DoctorSidebar />

      <div className="content-area">
        <PatientHeader user={doctor} />

        <main className="patient-content">
          <h2 className="profile-title">Doctor Profile</h2>

          <div className="profile-card">
            <img
              src={
                doctor.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/3870/3870822.png"
              }
              alt="profile"
              className="big-profile-pic"
            />

            <p><strong>Name:</strong> {doctor.name}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Role:</strong> {doctor.role}</p>

            <button
              className="edit-profile-btn"
              onClick={() => setEditOpen(true)}
            >
              Edit Profile
            </button>
          </div>
        </main>
      </div>

      {/* EDIT MODAL  */}
      {editOpen && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Profile</h3>

            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>New Password</label>
            <input
              type="password"
              placeholder="Leave empty to keep current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Profile Picture URL</label>
            <input
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
            />

            <div className="edit-btn-row">
              <button
                className="cancel-btn"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
