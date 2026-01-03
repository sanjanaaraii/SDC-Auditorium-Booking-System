import React, { useEffect, useState } from "react";
import axios from "axios";

const AudienceBookings = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/audience/events",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(res.data);
      } catch (err) {
        alert("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Upcoming Events</h1>

      {events.length === 0 ? (
        <p>No approved events yet.</p>
      ) : (
        events.map((e) => (
          <div
            key={e._id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>{e.eventName}</h3>
            <p>{e.description}</p>

            <p>
              <strong>Auditorium:</strong>{" "}
              {e.auditorium?.name}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(e.date).toDateString()}
            </p>

            <p>
              <strong>Time:</strong> {e.startTime} – {e.endTime}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AudienceBookings;
