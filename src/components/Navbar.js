
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
        <div className="navbar-brand">
          <img src="/muj-logo.png" alt="MUJ Logo" className="nav-logo" />

          <img src="/sdc-logo.png" alt="SDC Logo" className="nav-logo" />

          <div className="nav-divider"></div>

          <span className="nav-title">
            AudiBooker
          </span>
        </div>

        <ul className="navbar-links">
          {auth.token ? (
            <>
              {/* ADMIN */}
              {auth.user?.role === "admin" && (
                <>
                  <li>
                    <NavLink to="/admin" end>Admin Dashboard</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/organizer-requests">
                      Organizer Requests
                    </NavLink>
                  </li>
                </>
              )}

              {/* ORGANIZER */}
              {auth.user?.role === "organizer" && (
                <>
                  <li>
                    <NavLink to="/book">Book an Auditorium</NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-bookings">
                      My Bookings
                    </NavLink>
                  </li>
                </>
              )}

              {/* AUDIENCE */}
              {auth.user?.role === "audience" && (
                <>
                  <li>
                    <NavLink to="/events">Events</NavLink>
                  </li>
                  <li>
                    <NavLink to="/my-bookings">My Bookings</NavLink>
                  </li>
                  <li>
                  <NavLink to="/request-organizer">
                    Request to be Organizer
                  </NavLink>
                </li>
                </>
              )}

              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary"
                  style={{ width: "auto", padding: "0.5rem 1rem" }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink
                to="/auth"
                className="btn btn-primary"
                style={{ width: "auto", padding: "0.5rem 1rem",color: "#fff" }}
              >
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
