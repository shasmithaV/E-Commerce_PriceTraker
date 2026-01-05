import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import ShopEase from '../assets/ShopEase.jpeg';
import {jwtDecode} from "jwt-decode";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", { email, password });

       const token = res.data.accessToken;
       const decoded = jwtDecode(token);
       console.log("DECODED JWT:", decoded);

      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);       // 🔥 IMPORTANT
      localStorage.setItem("username", decoded.sub); // fallback

      // ✅ REDIRECT BASED ON ROLE
      if (decoded.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/products");
      }

    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <img src={ShopEase} alt="ShopEase" />
        <h1>Welcome to ShopEase</h1>
        <p>Your one-stop online shopping destination.</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">
          <h2>Sign In</h2>
          <p className="subtitle">Enter your account details</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>

            {error && <p className="error">{error}</p>}
          </form>

          <p className="signup-text">
            Don&apos;t have an account?
            <span onClick={() => navigate("/register")}> Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;