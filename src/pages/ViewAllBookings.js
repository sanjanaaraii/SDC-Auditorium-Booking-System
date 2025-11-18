import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import "./ViewAllBookings.css";  // <— IMPORTANT

const API_URL = 'http://localhost:5000/api/admin/bookings/all';

const ViewAllBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllBookings = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            setBookings(res.data);
        } catch (err) {
            setError('Failed to fetch bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const handleStatusUpdate = async (bookingId, status) => {
    try {
        await axios.patch(
            `http://localhost:5000/api/admin/bookings/${bookingId}/status`,
            { status }
        );
        fetchAllBookings();
    } catch (err) {
        alert(err.response?.data?.message || `Failed to update to ${status}.`);
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

    if (loading) return <div className="loading">Loading all bookings...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="page-container">
            <h2 className="page-title">All Bookings</h2>

            {bookings.length === 0 ? (
                <p>No bookings available.</p>
            ) : (
                <div className="booking-list">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="booking-card">

                            <div className="booking-header">
                                <h3>{booking.eventName}</h3>
                                <span className={getStatusClass(booking.status)}>
                                    {booking.status}
                                </span>
                            </div>

                            <p className="info">
                                <strong>Booked by:</strong> {booking.user?.name} ({booking.user?.email})
                            </p>

                            <p className="info">
                                <strong>Auditorium:</strong> {booking.auditorium.name} – {booking.auditorium.location}
                            </p>

                            <p className="info small">
                                {format(new Date(booking.date), "EEEE, MMM d yyyy")} <br/>
                                {booking.startTime} – {booking.endTime}
                            </p>

                            {booking.status === "Pending" && (
                                <div className="action-row">
                                    <button 
                                        onClick={() => handleStatusUpdate(booking._id, "Approved")}
                                        className="btn approve"
                                    >
                                        Approve
                                    </button>

                                    <button 
                                        onClick={() => handleStatusUpdate(booking._id, "Rejected")}
                                        className="btn reject"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewAllBookings;
