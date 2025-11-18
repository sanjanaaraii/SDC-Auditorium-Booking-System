import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/authpage.js";
import BookingPage from "./pages/BookingPage.js";
import MyBookingsPage from "./pages/mybookings.js";
import Navbar from "./components/Navbar.js";
import HomePage from "./pages/homepage.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import axios from "axios";

// ADD THESE 3 IMPORTS
import ManageAuditoriums from "./pages/ManageAuditoriums.js";
import ViewAllBookings from "./pages/ViewAllBookings.js";
import ManageUsers from "./pages/ManageUsers.js";

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
      localStorage.removeItem("user");
      localStorage.removeItem("token");
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
    if (auth?.token && auth.user?.role === "admin") {
      return children;
    }
    return <Navigate to="/book" />;
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
            
            {/* YOUR ORIGINAL AUTH ROUTE (NO CHANGES) */}
            <Route
              path="/auth"
              element={
                auth.token ? (
                  auth.user?.role === "admin" ? (
                    <Navigate to="/admin" />
                  ) : (
                    <Navigate to="/book" />
                  )
                ) : (
                  <AuthPage />
                )
              }
            />
            
            {/* YOUR ORIGINAL BOOK ROUTE (NO CHANGES) */}
            <Route
              path="/book"
              element={
                <PrivateRoute>
                  <BookingPage />
                </PrivateRoute>
              }
            />

            {/* YOUR ORIGINAL MY-BOOKINGS ROUTE (NO CHANGES) */}
            <Route
              path="/my-bookings"
              element={
                <PrivateRoute>
                  <MyBookingsPage />
                </PrivateRoute>
              }
            />

            {/* YOUR ORIGINAL ADMIN ROUTE (NO CHANGES) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* ADD THESE NEW ROUTES FOR THE ADMIN DASHBOARD LINKS */}
            <Route
              path="/admin/auditoriums"
              element={
                <AdminRoute>
                  <ManageAuditoriums />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <ViewAllBookings />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <ManageUsers />
                </AdminRoute>
              }
            />
            
            {/* YOUR ORIGINAL WILDCARD ROUTE (NO CHANGES) */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;