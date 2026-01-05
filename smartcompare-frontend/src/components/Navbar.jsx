import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("username");
    if (name) setUsername(name);
  }, []);

  const categories = [
    "Makeup", "Skin", "Hair", "Appliances", "Bath & Body",
    "Natural", "Mom & Baby", "Health & Wellness",
    "Men", "Fragrance", "Accessories"
  ];

  return (
    <header className="user-navbar">
  {/* TOP BAR */}
  <div className="user-navbar-top">
    {/* LEFT */}
    <div className="user-brand" onClick={() => navigate("/products")}>
      ShopEase
    </div>
    

    {/* RIGHT */}
    <div className="user-actions">
      <span className="user-greeting">
        Hi, <strong>{username || "User"}</strong>
      </span>

      <button
        className="cart-btn"
        onClick={() => navigate("/cart")}
        aria-label="Cart"
      >
        🛒
      </button>
    </div>
    

  </div>

  {/* CATEGORY BAR */}
  <nav className="user-categories">
    {categories.map(cat => (
      <span key={cat} className="category-item">
        {cat}
      </span>
    ))}
  </nav>
</header>

  );
}

export default Navbar;
