import React, { useEffect, useState } from "react";
import axios from "axios";
import SeatBookingModal from "../components/SeatBookingModal";
import "./AudienceBookings.css";
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
  <div className="page-container">
    <h1>Upcoming Events</h1>

    {events.length === 0 ? (
      <p>No approved events yet.</p>
    ) : (
      <div className="events-grid">
        {events.map((e) => (
          <div key={e._id} className="event-card">
            <h3>{e.eventName}</h3>

            <p className="event-desc">{e.description}</p>

            <p className="event-meta">
              <strong>Auditorium:</strong> {e.auditorium?.name}
            </p>

            <p className="event-meta">
              <strong>Date:</strong>{" "}
              {new Date(e.date).toDateString()}
            </p>

            <button
              className="book-btn"
              onClick={() => setSelectedEvent(e)}
            >
              Book
            </button>
          </div>
        ))}
      </div>
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
export default AudienceBookings;
