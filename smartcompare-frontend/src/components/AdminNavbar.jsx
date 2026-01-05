import { NavLink, useNavigate } from "react-router-dom";
import "../styles/AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <header className="admin-navbar">
      {/* LEFT */}
      <div className="admin-brand" onClick={() => navigate("/admin")}>
        Admin Panel
      </div>

      {/* CENTER LINKS */}
      <nav className="admin-nav-links">
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>
        <NavLink to="/admin/products">
          Products
        </NavLink>
        <NavLink to="/admin/orders">
          Orders
        </NavLink>
        <NavLink to="/admin/analytics">
          Analytics
        </NavLink>
        <NavLink to="/admin/external-prices">
          External Prices
        </NavLink>
      </nav>

      {/* RIGHT */}
      <button className="admin-logout" onClick={logout}>
        Logout
      </button>
    </header>
  );
}

export default AdminNavbar;
