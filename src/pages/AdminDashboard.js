import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="page-title">Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
      <p>
        From here, you will be able to manage auditoriums,
        view all bookings, and manage users.
      </p>

      <div className="admin-tools">
        <h2>Admin Tools</h2>
        <ul>
          <li>
            <button
              onClick={() => navigate('/admin/auditoriums')}
              className="btn btn-primary admin-btn"
            >
              Manage Auditoriums
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="btn btn-primary admin-btn"
            >
              View All Bookings
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate('/admin/users')}
              className="btn btn-primary admin-btn"
            >
              Manage Users
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
