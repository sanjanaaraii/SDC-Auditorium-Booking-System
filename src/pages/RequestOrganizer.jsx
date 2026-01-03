import React, { useState } from "react";
import axios from "axios";
import "./Audience.css";

const RequestOrganizer = () => {
  const [eventName, setEventName] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/audience/organizerRequest",
        { eventName, reason }
      );
      alert("Request sent to admin!");
      setEventName("");
      setReason("");
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="audience-container">
      <h2>Request Organizer Access</h2>

      <form className="request-form" onSubmit={submitRequest}>
        <label>Event Name</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />

        <label>Why do you want to organize this event?</label>
        <textarea
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default RequestOrganizer;
