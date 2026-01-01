import React, { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import PatientHeader from "../../components/PatientHeader";
import "../../style.css";

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setDoctor(u);
    setName(u?.name || "");
    setProfilePic(u?.profilePic || "");
  }, []);

  const handleUpdate = async () => {
    if (!doctor) return;

    const updatedDoctor = {
      ...doctor,
      name,
      password: password.trim() === "" ? undefined : password,
      profilePic
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${doctor.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedDoctor)
        }
      );

      if (!res.ok) throw new Error();

      const saved = await res.json();
      localStorage.setItem("user", JSON.stringify(saved));
      setDoctor(saved);
      setEditOpen(false);
      alert("Profile updated successfully!");
    } catch {
      alert("Error updating profile.");
    }
  };

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
                doctor?.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/3870/3870822.png"
              }
              alt="profile"
              className="big-profile-pic"
            />

            <p><strong>Name:</strong> {doctor?.name}</p>
            <p><strong>Email:</strong> {doctor?.email}</p>
            <p><strong>Role:</strong> {doctor?.role}</p>

            <button
              className="edit-profile-btn"
              onClick={() => setEditOpen(true)}
            >
              Edit Profile
            </button>
          </div>
        </main>
      </div>

      {/* ===== EDIT MODAL ===== */}
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
              placeholder="Leave empty to keep old password"
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
