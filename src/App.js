import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import AuthPage from "./pages/authpage.js";
import BookingPage from "./pages/BookingPage.js";
import MyBookingsPage from "./pages/mybookings.js";
import AudienceBookings from "./pages/AudienceBookings.js";
import QRVerify from "./pages/QRVerify";
import Navbar from "./components/Navbar.js";
import HomePage from "./pages/homepage.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import AdminLayout from "./pages/AdminLayout";
import ManageAuditoriums from "./pages/ManageAuditoriums.js";
import ViewAllBookings from "./pages/ViewAllBookings.js";
import ManageUsers from "./pages/ManageUsers.js";
import RequestOrganizer from "./pages/RequestOrganizer.jsx";
import AdminOrganizerRequests from "./pages/AdminOrganizerRequests.js";
export const AuthContext = createContext();

const App = () => {
  const [auth, setAuth] = useState({ token: null, user: null });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    try {
      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setAuth({ token, user: parsedUser });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error parsing user:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
    delete axios.defaults.headers.common["Authorization"];
  };

  const PrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
    return auth?.token ? children : <Navigate to="/auth" />;
  };

  const AdminRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
    return auth?.token && auth.user?.role === "admin"
      ? children
      : <Navigate to="/" />;
  };

  const OrganizerRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (!auth?.token) return <Navigate to="/auth" />;

    if (auth.user?.role !== "organizer") {
      if (auth.user?.role === "audience") {
        return <Navigate to="/events" />;
      }
      if (auth.user?.role === "admin") {
        return <Navigate to="/admin" />;
      }
      return <Navigate to="/" />;
    }

    return children;
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>

  <Route path="/" element={<HomePage />} />

  {/* AUTH */}
  <Route
    path="/auth"
    element={
      auth.token ? (
        auth.user?.role === "admin" ? (
          <Navigate to="/admin" />
        ) : auth.user?.role === "organizer" ? (
          <Navigate to="/book" />
        ) : (
          <Navigate to="/events" />
        )
      ) : (
        <AuthPage />
      )
    }
  />

  {/* ORGANIZER */}
  <Route
    path="/book"
    element={
      <OrganizerRoute>
        <BookingPage />
      </OrganizerRoute>
    }
  />

  {/* AUDIENCE */}
  <Route
    path="/events"
    element={
      <PrivateRoute>
        <AudienceBookings />
      </PrivateRoute>
    }
  />

  <Route
    path="/my-bookings"
    element={
      <PrivateRoute>
        <MyBookingsPage />
      </PrivateRoute>
    }
  />

  <Route path="/verify/:bookingId" element={<QRVerify />} />

  {/* ADMIN (Nested Layout) */}
  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="auditoriums" element={<ManageAuditoriums />} />
    <Route path="bookings" element={<ViewAllBookings />} />
    <Route path="users" element={<ManageUsers />} />
    <Route path="organizer-requests" element={<AdminOrganizerRequests />} />
  </Route>

  {/* REQUEST ORGANIZER */}
  <Route
    path="/request-organizer"
    element={
      <PrivateRoute>
        <RequestOrganizer />
      </PrivateRoute>
    }
  />

  <Route path="*" element={<Navigate to="/" />} />

</Routes>

        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
