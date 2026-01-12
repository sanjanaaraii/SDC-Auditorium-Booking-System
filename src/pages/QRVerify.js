import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const QRVerify = () => {
  const { bookingId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/audience/bookings/verify/${bookingId}`
        );
        setData(res.data);
      } catch {
        setError("Invalid or expired ticket");
      }
    };

    verify();
  }, [bookingId]);

  if (error) return <h2>{error}</h2>;
  if (!data) return <p>Verifying ticket...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Ticket Verified ✅</h2>
      <p><strong>Event:</strong> {data.event}</p>
      <p><strong>Auditorium:</strong> {data.auditorium}</p>
      <p><strong>Seat:</strong> {data.seat}</p>
      <p><strong>User:</strong> {data.user}</p>
      <p><strong>Status:</strong> {data.status}</p>
    </div>
  );
};

export default QRVerify;
