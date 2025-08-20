import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import "../styles/Profile.css";

const API_BASE = "http://localhost:3000";

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ bio: "", avatarUrl: "", location: "" });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.profile || {});
        setForm(res.data.profile || {});
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_BASE}/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.profile);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {editMode ? (
        <div className="profile-form">
          <input
            name="bio"
            placeholder="Bio"
            value={form.bio || ""}
            onChange={handleChange}
          />
          <input
            name="avatarUrl"
            placeholder="Avatar URL"
            value={form.avatarUrl || ""}
            onChange={handleChange}
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location || ""}
            onChange={handleChange}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div className="profile-view">
          <p><strong>Bio:</strong> {profile.bio || "N/A"}</p>
          <p><strong>Location:</strong> {profile.location || "N/A"}</p>
          {profile.avatarUrl && <img src={profile.avatarUrl} alt="avatar" />}
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}
