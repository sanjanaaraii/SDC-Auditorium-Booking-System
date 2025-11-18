import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <h1>Welcome to AudiBooker</h1>
      <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '600px', margin: '1rem auto' }}>
        The seamless solution for booking university auditoriums. Check availability, submit requests, and manage your bookings all in one place.
      </p>
      <Link to="/book" className="btn btn-primary" style={{ marginTop: '2rem', width: 'auto' }}>
        Book an Auditorium
      </Link>
    </div>
  );
};

export default HomePage;
