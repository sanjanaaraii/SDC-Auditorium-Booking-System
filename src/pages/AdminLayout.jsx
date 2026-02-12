import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./AdminDashboard.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="menu-btn"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>

        <h3 className="sidebar-title">Admin Panel</h3>

        <button onClick={() => { navigate("/admin"); setIsSidebarOpen(false); }}>
          Dashboard
        </button>

        <button onClick={() => { navigate("/admin/auditoriums"); setIsSidebarOpen(false); }}>
          Manage Auditoriums
        </button>

        <button onClick={() => { navigate("/admin/bookings"); setIsSidebarOpen(false); }}>
          View Bookings
        </button>

        <button onClick={() => { navigate("/admin/users"); setIsSidebarOpen(false); }}>
          Manage Users
        </button>
      </aside>

      {/* Main Content */}
      <main className="content">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;

