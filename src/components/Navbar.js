import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../App.js";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          AudiBooker
        </NavLink>
        <ul className="navbar-links">
          {auth.token ? (
            <>
              {/* === Conditional Links based on Role === */}
              {auth.user?.role === 'admin' ? (
                // ADMIN LINKS
                <li>
                  <NavLink to="/admin">
                    Admin Dashboard
                  </NavLink>
                </li>
              ) : (
                // REGULAR USER LINKS
                <>
                  <li>
                    <NavLink to="/book">
                      Book an Auditorium
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-bookings">
                      My Bookings
                    </NavLink>
                  </li>
                </>
              )}


              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary"
                  style={{width: 'auto', padding: '0.5rem 1rem'}}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/auth" className="btn btn-primary" style={{width: 'auto', padding: '0.5rem 1rem'}}>
                Login / Signup
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
