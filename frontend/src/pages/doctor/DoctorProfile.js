import React, { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import PatientHeader from "../../components/PatientHeader";
import api from "../../api";

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
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
    try {
      const res = await api.put(`/users/${doctor.id}`, {
        name,
        password: password || undefined,
        profilePic
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      setDoctor(res.data);
      setEditOpen(false);
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="patient-layout">
      <DoctorSidebar />
      <div className="content-area">
        <PatientHeader user={doctor} />

        <main className="patient-content">
          <h2>Doctor Profile</h2>

          <p>Name: {doctor?.name}</p>
          <p>Email: {doctor?.email}</p>
          <p>Role: {doctor?.role}</p>

          <button onClick={() => setEditOpen(true)}>Edit</button>
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
