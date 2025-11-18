import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h1 className="page-title">Admin Dashboard</h1>
            <p>Welcome, Admin!</p>
            <p>From here, you will be able to manage auditoriums, view all bookings, and manage users.</p>

            <div style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Admin Tools</h2>
                <ul>
                    {}
                    <li><button onClick={() => navigate('/admin/auditoriums')} className="btn btn-primary" style={{margin: '0.5rem'}}>Manage Auditoriums</button></li>
                    <li><button onClick={() => navigate('/admin/bookings')} className="btn btn-primary" style={{margin: '0.5rem'}}>View All Bookings</button></li>
                    <li><button onClick={() => navigate('/admin/users')} className="btn btn-primary" style={{margin: '0.5rem'}}>Manage Users</button></li>
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;