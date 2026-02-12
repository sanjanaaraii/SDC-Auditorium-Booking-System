import React, { useState, useEffect } from 'react';

import './AdminDashboard.css';

const AdminDashboard = () => {
   
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
