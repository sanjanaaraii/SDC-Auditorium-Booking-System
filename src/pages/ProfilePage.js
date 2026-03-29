import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const [phone, setPhone] = useState(auth.user?.phone || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const isValidPhone = (val) => /^[+\d\s\-()]{7,15}$/.test(val.trim());

  const handleSave = async () => {
    setMessage({ text: "", type: "" });

    if (phone && !isValidPhone(phone)) {
      setMessage({ text: "Please enter a valid phone number.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        "/api/user/profile",
        { phone },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setAuth({ ...auth, user: res.data });
      localStorage.setItem("user", JSON.stringify(res.data));
      setMessage({ text: "Profile updated successfully.", type: "success" });
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.message || "Error updating profile. Try again.";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!auth?.user) {
    return (
      <div className="profile-page">
        <p className="profile-loading">Loading profile…</p>
      </div>
    );
  }

  const initials = auth.user.name
    ? auth.user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div>
            <h2 className="profile-title">Your Profile</h2>
            <p className="profile-subtitle">Manage your account details</p>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">Name</span>
            <span className="info-value">{auth.user.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{auth.user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Role</span>
            <span className="role-badge">{auth.user.role}</span>
          </div>
        </div>

        <div className="phone-field">
          <label htmlFor="phone">Phone Number</label>
          <div className="phone-input-wrapper">
            <span className="phone-icon">📞</span>
            <input
              id="phone"
              type="tel"
              className="phone-input"
              placeholder="+1 (555) 000-0000"
              value={phone}
              disabled={loading}
              onChange={(e) => {
                setPhone(e.target.value);
                setMessage({ text: "", type: "" });
              }}
            />
          </div>
        </div>

        {message.text && (
          <p className={`feedback-msg ${message.type}`}>{message.text}</p>
        )}

        <button className="save-btn" onClick={handleSave} disabled={loading}>
          {loading ? "Saving…" : "Save Changes"}
        </button>

      </div>
    </div>
  );
};

export default ProfilePage;