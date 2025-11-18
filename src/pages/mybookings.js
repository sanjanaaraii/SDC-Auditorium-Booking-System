import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Cancelled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center">Loading your bookings...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h2>
            {bookings.length === 0 ? (
                <p className="text-gray-500">You have not made any bookings yet.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="flex-1 mb-4 md:mb-0">
                                <h3 className="text-xl font-bold text-blue-600">{booking.eventName}</h3>
                                <p className="text-gray-700">{booking.auditorium.name} - {booking.auditorium.location}</p>
                                <p className="text-gray-500">
                                    {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')} from {booking.startTime} to {booking.endTime}
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                                {(booking.status === 'Pending' || booking.status === 'Approved') && (
                                    <button onClick={() => handleCancel(booking._id)} className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 text-sm">
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
