import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/auditoriums';
const ManageAuditoriums = () => {
    const [auditoriums, setAuditoriums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', location: '', capacity: '' });
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    const fetchAuditoriums = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            setAuditoriums(res.data);
        } catch (err) {
            setError('Failed to fetch auditoriums.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditoriums();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' });
        try {
            await axios.post(API_URL, formData);
            setFormMessage({ type: 'success', text: 'Auditorium added successfully!' });
            setFormData({ name: '', location: '', capacity: '' });
            fetchAuditoriums(); // Refresh the list
        } catch (err) {
            setFormMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add auditorium.' });
        }
    };

    if (loading) return <div className="text-center">Loading auditoriums...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Auditoriums</h2>

            {/* Add Auditorium Form */}
            <div className="form-container mb-8">
                <h3 className="text-2xl font-semibold mb-4">Add New Auditorium</h3>
                {formMessage.text && <div className={`message-container message-${formMessage.type}`}>{formMessage.text}</div>}
            _   <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Auditorium Name</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
            _             <label htmlFor="location">Location</label>
                        <input id="location" type="text" name="location" value={formData.location} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="capacity">Capacity</label>
                        <input id="capacity" type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Auditorium</button>
                </form>
            </div>

            {/* List of Auditoriums */}
          _ <div>
                <h3 className="text-2xl font-semibold mb-4">Existing Auditoriums</h3>
                {auditoriums.length === 0 ? (
                    <p>No auditoriums found.</p>
                ) : (
                    <div className="space-y-4">
                        {auditoriums.map(audi => (
                            <div key={audi._id} className="bg-white p-4 rounded-lg shadow-md">
                                <p className="text-xl font-bold">{audi.name}</p>
                                <p className="text-gray-600">{audi.location}</p>
                                <p className="text-gray-600">Capacity: {audi.capacity}</p>
                            </div>
                        ))}
                    </div>
             )}
            </div>
        </div>
    );
};

export default ManageAuditoriums;