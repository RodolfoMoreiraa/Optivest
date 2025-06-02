// Profile.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import "./Profile.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("http://127.0.0.1:8000/api/profile/")
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => console.error("Erro ao buscar perfil:", err));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    axiosInstance.put("http://127.0.0.1:8000/api/profile/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        const imageUrl = URL.createObjectURL(file);
        setProfile((prev) => ({
          ...prev,
          profile_image_url: imageUrl,
        }));
      })
      .catch((err) => console.error("Erro ao atualizar imagem:", err));
  };

  return (
    <div className="profile-page glass-effect fade-in">
      <div onClick={() => navigate("/")} className="back-button">
        <FaArrowLeft size={20} color="#3b82f6" />
      </div>
      <h2 className="profile-title">Perfil</h2>
      {profile ? (
        <div className="profile-card">
          {profile.profile_image_url && (
            <img
              src={profile.profile_image_url}
              alt="Foto de perfil"
              className="profile-avatar"
            />
          )}

          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="fileInput" className="upload-label">
            Alterar Foto
          </label>

          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Data de Registo:</strong> {new Date(profile.date_joined).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Precisa de estar autenticado!</p>
      )}
    </div>
  );
};

export default Profile;

