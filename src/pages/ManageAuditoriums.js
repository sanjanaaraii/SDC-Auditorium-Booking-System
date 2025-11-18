import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageAuditoriums.css"; 

const API_URL = "http://localhost:5000/api/admin/auditoriums";

const ManageAuditoriums = () => {
  const [auditoriums, setAuditoriums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
  });
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  const fetchAuditoriums = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setAuditoriums(res.data);
    } catch (err) {
      setError("Failed to fetch auditoriums.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditoriums();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: "", text: "" });

    try {
      await axios.post(API_URL, formData);
      setFormMessage({
        type: "success",
        text: "Auditorium added successfully!",
      });
      setFormData({ name: "", location: "", capacity: "" });
      fetchAuditoriums();
    } catch (err) {
      setFormMessage({
        type: "error",
        text:
          err.response?.data?.message || "Failed to add auditorium.",
      });
    }
  };

  if (loading) return <div className="center-text">Loading auditoriums...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="aud-page">
      <h2 className="page-title">Manage Auditoriums</h2>

      {/* Add Auditorium Form */}
      <div className="aud-form-card">
        <h3>Add New Auditorium</h3>

        {formMessage.text && (
          <div className={`msg ${formMessage.type}`}>
            {formMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Auditorium Name</label>
          <input
            type="text"
            name="name"
            placeholder="Example: A-Block Auditorium"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="Example: 2nd Floor, A Block"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label>Capacity</label>
          <input
            type="number"
            name="capacity"
            placeholder="Example: 250"
            value={formData.capacity}
            onChange={handleChange}
            required
          />

          <button className="primary-btn" type="submit">
            Add Auditorium
          </button>
        </form>
      </div>

      {/* Grid of Auditoriums */}
      <h3 className="section-title">Existing Auditoriums</h3>

      {auditoriums.length === 0 ? (
        <p>No auditoriums found.</p>
      ) : (
        <div className="aud-grid">
          {auditoriums.map((audi) => (
            <div key={audi._id} className="aud-card">
              <h3>{audi.name}</h3>
              <p className="text-light">{audi.location}</p>
              <p className="text-light">Capacity: {audi.capacity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAuditoriums;
