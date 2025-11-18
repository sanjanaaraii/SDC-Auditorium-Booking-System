import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import "./BookingPage.css";

const API_URL = 'http://localhost:5000/api';

const BookingPage = () => {
    const [auditoriums, setAuditoriums] = useState([]);
    const [formData, setFormData] = useState({
        auditoriumId: '',
        eventName: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        seats: 1
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAuditoriums = async () => {
            try {
                const res = await axios.get(`${API_URL}/auditoriums`);
                setAuditoriums(res.data);

                if (res.data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        auditoriumId: res.data[0]._id
                    }));
                }
            } catch (error) {
                setMessage({
                    type: 'error',
                    text: 'Could not load auditoriums. Make sure backend is running.'
                });
            }
        };
        fetchAuditoriums();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await axios.post(`${API_URL}/bookings`, formData);

            setMessage({
                type: 'success',
                text: 'Booking request submitted successfully!'
            });

            setFormData({
                ...formData,
                eventName: '',
                description: '',
                date: '',
                startTime: '',
                endTime: '',
                seats: 1
            });
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to submit booking.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-container">
            <h2 className="page-title">Book an Auditorium</h2>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form className="booking-form" onSubmit={handleSubmit}>
                
                <div className="form-group">
                    <label>Auditorium</label>
                    <select
                        name="auditoriumId"
                        value={formData.auditoriumId}
                        onChange={handleChange}
                        required
                    >
                        {auditoriums.map(aud => (
                            <option key={aud._id} value={aud._id}>
                                {aud.name} ({aud.location})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Event Name</label>
                    <input
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Event Description</label>
                    <textarea
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Time row */}
                <div className="time-row">
                    <div className="form-group">
                        <label>Start Time</label>
                        <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>End Time</label>
                        <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Seats selection */}
                <div className="form-group">
                    <label>Number of Seats</label>
                    <input
                        type="number"
                        name="seats"
                        min="1"
                        max="10"
                        value={formData.seats}
                        onChange={handleChange}
                        required
                    />
                    <small className="hint">Choose up to 10 seats </small>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Submitting..." : "Submit Booking Request"}
                </button>
            </form>
        </div>
    );
};

export default BookingPage;
