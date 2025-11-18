import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

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
            await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, { status });
            fetchAllBookings(); // Refresh bookings after update
        } catch (err) {
            alert(err.response?.data?.message || `Failed to update status to ${status}.`);
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

    if (loading) return <div className="text-center">Loading all bookings...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">All Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings have been made yet.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="flex-1 mb-4 md:mb-0">
                _                   <h3 className="text-xl font-bold text-blue-600">{booking.eventName}</h3>
                                    <p className="text-gray-700 font-semibold">Booked by: {booking.user?.name || 'N/A'} ({booking.user?.email || 'N/A'})</p>
                                    <p className="text-gray-700">{booking.auditorium.name} - {booking.auditorium.location}</p>
                                    <p className="text-gray-500">
                                        {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')} from {booking.startTime} to {booking.endTime}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                     _               <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
----------------                              {booking.status}
                                    </span>
                                </div>
                            </div>
                            {booking.status === 'Pending' && (
                                <div className="mt-4 pt-4 border-t flex items-center gap-2">
----------------                            <button
                                        onClick={() => handleStatusUpdate(booking._id, 'Approved')}
tr                                       className="btn btn-success text-sm"
                                    >
                    A                   Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                                        className="btn btn-danger text-sm"
                                    >
                                        Reject
s                               </button>
              _               </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewAllBookings;