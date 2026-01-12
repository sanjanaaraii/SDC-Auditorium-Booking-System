import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import "./MyBookingsPage.css";

const API_URL = 'http://localhost:5000/api';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await axios.delete(`${API_URL}/bookings/${bookingId}`);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel booking.");
        }
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

            {bookings.length === 0 ? (
                <p className="empty-text">You have not made any bookings yet.</p>
            ) : (
                <div className="booking-list">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="booking-card">

                            {/* Left side details */}
                            <div className="booking-info">
                                <h3 className="event-title">{booking.eventName}</h3>

                                <p className="info">
                                    <strong>Auditorium:</strong> {booking.auditorium.name} – {booking.auditorium.location}
                                </p>

                                {booking.bookingType === "EVENT" && (
                            <p className="date">
                                {format(new Date(booking.date), "EEEE, MMM d yyyy")} <br />
                                {booking.startTime} – {booking.endTime}
                            </p>
                            )}

                                        {booking.bookingType === "SEAT" && (
                                        <p className="date">
                                            <strong>Seat:</strong> {booking.seats?.[0]}
                                        </p>
                                        )}

                            </div>

                            {/* Right side status + cancel */}
                            <div className="booking-actions">
                                <span className={getStatusClass(booking.status)}>
                                    {booking.status}
                                </span>

                                {(booking.status === "Pending" || booking.status === "Approved") && (
                                    <button 
                                        onClick={() => handleCancel(booking._id)} 
                                        className="cancel-btn"
                                    >
                                        Cancel
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
