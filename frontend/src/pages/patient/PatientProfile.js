import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";
import PatientSidebar from "../../components/PatientSidebar";
import api from "../../services/api";
import "../../style.css";

export default function PatientProfile() {
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

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
    try {
      const res = await api.put(`/users/${user.id}`, {
        name,
        password: password.trim() === "" ? undefined : password,
        profilePic
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setEditOpen(false);
    } catch {
      alert("❌ Error updating profile");
    }
  };

  const getProfileImage = (pic) => {
    if (!pic || pic.trim() === "") {
      return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    }
    return pic;
  };

  return (
    <div className="patient-layout">
      <PatientSidebar />

      <div className="content-area">
        <PatientHeader user={user} />

        <main className="patient-content">
          <h2 className="profile-title">👤 Your Profile</h2>

          <div className="profile-card">
            <img
              src={getProfileImage(user?.profilePic)}
              alt="profile"
              className="big-profile-pic"
            />

            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>

            <button
              className="edit-profile-btn"
              onClick={() => setEditOpen(true)}
            >
              ✏️ Edit Profile
            </button>
          </div>
        </main>
      </div>

      {/* ================= EDIT MODAL ================= */}
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
