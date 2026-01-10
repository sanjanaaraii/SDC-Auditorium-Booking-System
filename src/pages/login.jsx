// src/pages/login.jsx
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (user.role === "admin") navigate("/admin");
    else if (user.role === "organizer") navigate("/book");
    else navigate("/audience-bookings");
  };
};
