import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import PatientHeader from "../../components/PatientHeader";
import "../../style.css";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setAdmin(u);
    setName(u?.name || "");
    setProfilePic(u?.profilePic || "");
  }, []);

  const getProfileImage = (pic) => {
    if (!pic || pic.trim() === "" || pic === "profile") {
      return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    }
    return pic;
  };

  const handleUpdate = async () => {
    if (!admin) return;

    const updatedAdmin = {
      ...admin,
      name,
      password: password.trim() === "" ? undefined : password,
      profilePic,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${admin.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAdmin),
        }
      );

      if (!res.ok) throw new Error();

      const saved = await res.json();
      localStorage.setItem("user", JSON.stringify(saved));
      setAdmin(saved);
      setEditOpen(false);
    } catch {
      alert("Error updating profile.");
    }
  };

  return (
    <div className="patient-layout">
      <AdminSidebar />

      <div className="content-area">
        <PatientHeader user={admin} />

        <main className="patient-content">
          <h2 className="profile-title">Admin Profile</h2>

          <div className="profile-card">
            <img
              src={getProfileImage(admin?.profilePic)}
              alt="profile"
              className="big-profile-pic"
            />

            <p><strong>Name:</strong> {admin?.name}</p>
            <p><strong>Email:</strong> {admin?.email}</p>
            <p><strong>Role:</strong> {admin?.role}</p>

            <button
              className="edit-profile-btn"
              onClick={() => setEditOpen(true)}
            >
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
