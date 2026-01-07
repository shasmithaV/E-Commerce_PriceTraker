import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import ShopEase from "../assets/ShopEase.jpeg";
import { jwtDecode } from "jwt-decode";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setError("");
  setLoading(true);

  try {
    const res = await api.post("/auth/login", { email, password });

    console.log("LOGIN RESPONSE:", res.data); // 🔍 debug

    const token = res.data.accessToken; // ✅ FIXED
    const decoded = jwtDecode(token);

    localStorage.setItem("token", token);
    localStorage.setItem("role", decoded.role);
    localStorage.setItem("username", decoded.sub);

    if (decoded.role === "ROLE_ADMIN") {
      navigate("/admin");
    } else {
      navigate("/products");
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="login-container">
      {/* LEFT SECTION */}
      <div className="login-left">
        <img src={ShopEase} alt="ShopEase" />
        <h1>Welcome to ShopEase</h1>
        <p>Your one-stop online shopping destination.</p>
      </div>

      {/* RIGHT SECTION */}
      <div className="login-right">
        <div className="login-card">
          <h2>Sign In</h2>
          <p className="subtitle">Enter your account details</p>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* LOGIN BUTTON */}
          <button
  type="button"
  onClick={(e) => {
    e.preventDefault();     // ⛔ stop form submit
    e.stopPropagation();    // ⛔ stop bubbling to parent form
    handleLogin();          // ✅ run login logic
  }}
>
  Login
</button>


          {/* ERROR MESSAGE */}
          {error && <p className="error">{error}</p>}

          {/* REGISTER */}
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
