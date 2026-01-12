import React, { useEffect, useState } from "react";
import axios from "axios";
import SeatBookingModal from "../components/SeatBookingModal";
const AudienceBookings = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
          <div key={e._id} style={cardStyle}>
            <h3>{e.eventName}</h3>
            <p>{e.description}</p>

            <p>
              <strong>Auditorium:</strong> {e.auditorium?.name}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(e.date).toDateString()}
            </p>

            <button onClick={() => setSelectedEvent(e)}>
              Book
            </button>
          </div>
        ))
      )}

      {selectedEvent && (
        <SeatBookingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "8px",
};

export default AudienceBookings;
