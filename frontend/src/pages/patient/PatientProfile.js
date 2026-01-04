import React, { useEffect, useState } from "react";
import PatientHeader from "../../components/PatientHeader";
import PatientSidebar from "../../components/PatientSidebar";
import api from "../../api";
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
        password: password || undefined,
        profilePic
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setEditOpen(false);
      alert("Profile updated!");
    } catch {
      alert("Error updating profile");
    }
  };

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <div className="content-area">
        <PatientHeader user={user} />
        <main className="patient-content">
          <h2>Your Profile</h2>
          <p><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>

          <button onClick={() => setEditOpen(true)}>Edit Profile</button>
        </main>
      </div>

      {editOpen && (
        <div className="edit-modal">
          <input value={name} onChange={e => setName(e.target.value)} />
          <input type="password" onChange={e => setPassword(e.target.value)} />
          <input value={profilePic} onChange={e => setProfilePic(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
        </div>
      )}
    </div>
  );
}
