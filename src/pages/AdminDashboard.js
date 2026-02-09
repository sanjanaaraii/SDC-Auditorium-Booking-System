import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 
  const [stats, setStats] = useState({
    auditoriums: 0,
    bookings: 0,
    users: 0,
  });

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats');
      const data = await response.json();

      setStats({
        auditoriums: data.auditoriums,
        bookings: data.bookings,
        users: data.users,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  fetchStats();
}, []);


  return (
    <>
     
      {!isSidebarOpen && (
        <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
          ☰
        </button>
      )}

      {isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {isSidebarOpen && (
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
            ✕
          </button>
        )}

        <h3 className="sidebar-title">Admin Panel</h3>

        <button onClick={() => navigate('/admin/auditoriums')}>
          Manage Auditoriums
        </button>
        <button onClick={() => navigate('/admin/bookings')}>
          View Bookings
        </button>
        <button onClick={() => navigate('/admin/users')}>
          Manage Users
        </button>
      </aside>

     
      <main className="content">
        <h1>Welcome, Admin 👋</h1>
        <p>
          Use the menu to manage auditoriums, monitor bookings,
          and control user access.
        </p>

        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Auditoriums</h4>
            <p>{stats.auditoriums}</p>
          </div>

          <div className="stat-card">
            <h4>Total Bookings</h4>
            <p>{stats.bookings}</p>
          </div>

          <div className="stat-card">
            <h4>Registered Users</h4>
            <p>{stats.users}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
