import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import "./MyBookingsPage.css";

const API_URL = 'http://localhost:5000/api';
 


const MyBookingsPage = () => {
    
    const storedUser = localStorage.getItem("user");
const role = storedUser ? JSON.parse(storedUser).role : null;

console.log("ROLE:", role);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [actionMessage, setActionMessage] = useState('');
    const [actionType, setActionType] = useState(''); // success | error
    const [deletingId, setDeletingId] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/bookings`);
            setBookings(res.data);
        } catch (err) {
            setError('Failed to fetch bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        setDeletingId(bookingId);

        try {
            await axios.delete(`${API_URL}/bookings/${bookingId}`);
            setActionMessage("Booking cancelled successfully.");
            setActionType("success");
            fetchBookings();
        } catch (err) {
            setActionMessage(err.response?.data?.message || "Failed to cancel booking.");
            setActionType("error");
        } finally {
            setDeletingId(null);
        }

        setTimeout(() => {
            setActionMessage('');
            setActionType('');
        }, 3000);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Approved": return "status approved";
            case "Pending": return "status pending";
            case "Rejected": return "status rejected";
            case "Cancelled": return "status cancelled";
            default: return "status";
        }
    };

    if (loading) return <div className="center-text">Loading your bookings...</div>;
    if (error) return <div className="error-text">{error}</div>;

    return (
        <div className="bookings-container">
            <h2 className="page-title">My Bookings</h2>

           
            {actionMessage && (
                <div className={`action-message ${actionType}`}>
                    {actionMessage}
                </div>
            )}

            {role === "organizer" && (
    <div className="stats-container">
        <div className="stat-box">
            <h3>{bookings.length}</h3>
            <p>Total</p>
        </div>

        <div className="stat-box">
            <h3>{bookings.filter(b => b.status === "Approved").length}</h3>
            <p>Approved</p>
        </div>

        <div className="stat-box">
            <h3>{bookings.filter(b => b.status === "Pending").length}</h3>
            <p>Pending</p>
        </div>

        <div className="stat-box">
            <h3>{bookings.filter(b => b.status === "Rejected").length}</h3>
            <p>Rejected</p>
        </div>
    </div>
)}


            {bookings.length === 0 ? (
                <p className="empty-text">You have not made any bookings yet.</p>
            ) : (
                <div className="booking-list">
                    {bookings.map((booking) => (
                       <div key={booking._id} className="booking-card">

    <h3 className="event-title">{booking.eventName}</h3>

    <p className="info">
        <strong>Auditorium:</strong> {booking.auditorium.name} – {booking.auditorium.location}
    </p>

    {booking.bookingType === "EVENT" && (
        <>
            <p className="date">
                {format(new Date(booking.date), "EEEE, MMM dd yyyy")}
            </p>
            <p className="date">
                {booking.startTime} – {booking.endTime}
            </p>
        </>
    )}

    {booking.bookingType === "SEAT" && (
        <p className="date">
            <strong>Seat:</strong> {booking.seats?.[0]}
        </p>
    )}

    <div className="card-bottom">
        <span className={getStatusClass(booking.status)}>
            {booking.status}
        </span>

        {(booking.status === "Pending" || booking.status === "Approved") && (
            <button
                onClick={() => handleCancel(booking._id)}
                className="cancel-btn"
                disabled={deletingId === booking._id}
            >
                {deletingId === booking._id ? "Cancelling..." : "Cancel"}
            </button>
        )}
    </div>

</div>

                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
