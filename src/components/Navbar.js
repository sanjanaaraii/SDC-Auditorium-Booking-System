import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App.js";

const Navbar = () => {
  const { auth, logout, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState(auth.user?.phone || "");

  const dropdownRef = useRef(null);

  // ✅ FIX 1: sync phone when user changes
  useEffect(() => {
    setPhone(auth.user?.phone || "");
  }, [auth.user]);

  // ✅ FIX 2: dependency added
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
        setEditingPhone(false);
        setPhone(auth.user?.phone || "");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [auth.user?.phone]);

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
          <span className="nav-title">AudiBooker</span>
        </div>

        <ul className="navbar-links">
          {auth.token ? (
            <>
              {auth.user?.role === "admin" && (
                <>
                  <li><NavLink to="/admin" end>Admin Dashboard</NavLink></li>
                  <li><NavLink to="/admin/organizer-requests">Organizer Requests</NavLink></li>
                </>
              )}

              {auth.user?.role === "organizer" && (
                <>
                  <li><NavLink to="/book">Book an Auditorium</NavLink></li>
                  <li><NavLink to="/my-bookings">My Bookings</NavLink></li>
                </>
              )}

              {auth.user?.role === "audience" && (
                <>
                  <li><NavLink to="/events">Events</NavLink></li>
                  <li><NavLink to="/my-bookings">My Bookings</NavLink></li>
                  <li><NavLink to="/request-organizer">Request to be Organizer</NavLink></li>
                </>
              )}

              <li style={{ position: "relative" }} ref={dropdownRef}>
                <div
                  onClick={() => setShowProfile(!showProfile)}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                >
                  👤
                </div>

                {showProfile && (
                  <div className="profile-dropdown">
                    <p><strong>Name:</strong> {auth.user?.name}</p>
                    <p><strong>Email:</strong> {auth.user?.email}</p>
                    <p><strong>Role:</strong> {auth.user?.role}</p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {editingPhone ? (
                        <span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="dropdown-phone-input"
                            autoFocus
                          />
                          <button
                            onClick={async () => {
                              try {
                                const res = await axios.put(
                                    "http://localhost:5000/api/auth/profile",
                                    { phone },
                                    {
                                      headers: {
                                        Authorization: `Bearer ${auth.token}`,
                                      },
                                    }
                                  );
                                setAuth({ ...auth, user: res.data });
                                localStorage.setItem(
                                  "user",
                                  JSON.stringify(res.data)
                                );
                                setEditingPhone(false);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingPhone(false);
                              setPhone(auth.user?.phone || "");
                            }}
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <span>
                          {auth.user?.phone || "Not added"}{" "}
                          <button onClick={() => setEditingPhone(true)}>
                            Edit
                          </button>
                        </span>
                      )}
                    </p>

                    <button onClick={handleLogout} style={{ marginTop: "5px" }}>
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li>
              <NavLink
                to="/auth"
                className="btn btn-primary"
                style={{
                  width: "auto",
                  padding: "0.5rem 1rem",
                  color: "#fff",
                }}
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