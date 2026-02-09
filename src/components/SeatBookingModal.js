import React, { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";

const seats = ["A1", "A2", "A3", "A4", "A5"];

const SeatBookingModal = ({ event, onClose }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  const bookSeat = async () => {
    if (!selectedSeat) {
      alert("Select exactly one seat");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/audience/bookings",
        {
          auditoriumId: event.auditorium._id,
          seats: [selectedSeat],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setBookingId(res.data.booking._id);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <span style={close} onClick={onClose}>✖</span>

        <h2>Book Seat</h2>

        {!bookingId ? (
          <>
            <div style={seatGrid}>
              {seats.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSeat(s)}
              style={seatButton(selectedSeat === s)}
            >
              {s}
            </button>

              ))}
            </div>

            <button style={confirmButton}
             onClick={bookSeat}>Confirm Booking</button>
          </>
        ) : (
          <>
            <h3>Booking Confirmed ✅</h3>
            <QRCode
              value={`http://localhost:3000/verify/${bookingId}`}
            />
            <p>Scan this QR at entry</p>
          </>
        )}
      </div>
    </div>
  );
};
const confirmButton = {
  marginTop: "1rem",
  padding: "12px",
  width: "100%",
  backgroundColor: "#63385a",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  padding: "2rem",
  width: "400px",
  margin: "5% auto",
  position: "relative",
  borderRadius: "8px",
};

const close = {
  position: "absolute",
  top: "10px",
  right: "12px",
  cursor: "pointer",
};

const seatGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "10px",
  marginBottom: "1rem",
};
const seatButton = (isSelected) => ({
  padding: "10px 0",
  borderRadius: "6px",
  border: isSelected ? "2px solid #8d5f85" : "1px solid #d1d5db",
  backgroundColor: isSelected ? "#b991b1" : "#f9fafb",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  outline: "none",
});

export default SeatBookingModal;
