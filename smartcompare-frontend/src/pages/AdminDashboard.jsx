import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <AdminNavbar />

      <div className="admin-dashboard">
        {/* HEADER */}
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your store efficiently</p>
        </div>

        {/* GRID */}
        <div className="admin-grid">
          {/* PRODUCTS */}
          <div
            className="admin-card"
            onClick={() => navigate("/admin/products")}
          >
            <div className="admin-card-icon">🛒</div>
            <h3>Manage Products</h3>
            <p>Update price, stock and inventory</p>
          </div>

          {/* ORDERS */}
          <div
            className="admin-card"
            onClick={() => navigate("/admin/orders")}
          >
            <div className="admin-card-icon">📦</div>
            <h3>Orders</h3>
            <p>View and manage customer orders</p>
          </div>

          {/* ANALYTICS (DISABLED) */}
          <div className="admin-card"
          onClick={() => navigate("/admin/analytics")}>
            <div className="admin-card-icon">📊</div>
            <h3>Analytics</h3>
            <p>Sales insights & trends (coming soon)</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
