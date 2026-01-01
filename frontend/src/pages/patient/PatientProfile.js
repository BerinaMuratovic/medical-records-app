import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";
import PatientSidebar from "../../components/PatientSidebar";
import "../../style.css";

export default function PatientProfile() {
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    setName(u?.name || "");
    setProfilePic(u?.profilePic || "");
  }, []);

  const handleUpdate = async () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      name,
      password: password.trim() === "" ? undefined : password,
      profilePic,
    };

    const res = await fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    if (res.ok) {
      const saved = await res.json();
      localStorage.setItem("user", JSON.stringify(saved));
      setUser(saved);
      setEditOpen(false);
      alert("Profile updated!");
    } else {
      alert("Error updating profile.");
    }
  };

  return (
    <div className="patient-layout">
      <PatientSidebar />

      <div className="content-area">
        <PatientHeader user={user} />

        <main className="patient-content">
          <h2 className="profile-title">Your Profile</h2>

          <div className="profile-card">
            <img
              src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt="profile"
              className="big-profile-pic"
            />

            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>

            <button className="edit-profile-btn" onClick={() => setEditOpen(true)}>
              Edit Profile
            </button>
          </div>
        </main>
      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Profile</h3>

            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />

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
              <button className="cancel-btn" onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleUpdate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
