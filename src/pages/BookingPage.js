import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = 'http://localhost:5000/api';

const BookingPage = () => {
    const [auditoriums, setAuditoriums] = useState([]);
    const [formData, setFormData] = useState({
        auditoriumId: '',
        eventName: '',
        date: '',
        startTime: '',
        endTime: '',
        description: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchAuditoriums = async () => {
            try {
                const res = await axios.get(`${API_URL}/auditoriums`);
                setAuditoriums(res.data);
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, auditoriumId: res.data[0]._id }));
                }
            } catch (error) {
                 setMessage({ type: 'error', text: 'Could not load auditoriums. Make sure the backend is running.' });
            }
        };
        fetchAuditoriums();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage({type: '', text: ''});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await axios.post(`${API_URL}/bookings`, {
                auditoriumId: formData.auditoriumId,
                eventName: formData.eventName,
                description: formData.description,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime
            });
            setMessage({ type: 'success', text: 'Booking request submitted successfully!' });
            setFormData({
                ...formData,
                eventName: '',
                description: '',
                date: '',
                startTime: '',
                endTime: ''
            });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit booking.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Book an Auditorium</h2>
            
            {message.text && <div className={`message-container message-${message.type}`}>{message.text}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="auditoriumId">Auditorium</label>
                    <select id="auditoriumId" name="auditoriumId" value={formData.auditoriumId} onChange={handleChange} required>
                        {auditoriums.map(auditorium => (
                            <option key={auditorium._id} value={auditorium._id}>
                                {auditorium.name} ({auditorium.location})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="eventName">Event Name</label>
                    <input id="eventName" type="text" name="eventName" value={formData.eventName} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label htmlFor="description">Event Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} min={format(new Date(), 'yyyy-MM-dd')} required />
                </div>
                <div className="form-group" style={{display: 'flex', gap: '1rem'}}>
                    <div style={{flex: 1}}>
                        <label htmlFor="startTime">Start Time</label>
                        <input id="startTime" type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                    </div>
                    <div style={{flex: 1}}>
                        <label htmlFor="endTime">End Time</label>
                        <input id="endTime" type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Submitting...' : 'Submit Booking Request'}
                </button>
            </form>
        </div>
    );
};

export default BookingPage;
