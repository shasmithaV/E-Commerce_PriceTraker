import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminOrders.css";

const STATUS_OPTIONS = ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"];

const VALID_TRANSITIONS = {
  PLACED: ["PLACED", "SHIPPED", "CANCELLED"],
  SHIPPED: ["SHIPPED", "DELIVERED"],
  DELIVERED: ["DELIVERED"],
  CANCELLED: ["CANCELLED"],
};

const isAllowed = (current, next) =>
  VALID_TRANSITIONS[current]?.includes(next);

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    api.get("/admin/orders")
      .then(res => setOrders(res.data || []))
      .catch(() => alert("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/admin/orders/${orderId}/status`, null, {
        params: { status }
      });
      fetchOrders();
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <p className="admin-orders-loading">Loading orders…</p>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="admin-orders-page">
        <h2 className="admin-orders-title">Orders Management</h2>

        {orders.length === 0 && (
          <p className="admin-orders-empty">No orders found.</p>
        )}

        {orders.map(order => (
          <div key={order.id} className="admin-order-card">
            {/* HEADER */}
            <div className="order-top">
              <div>
                <h3>Order #{order.id}</h3>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <div className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </div>
            </div>

            {/* META */}
            <div className="order-meta">
              <span>User: {order.user?.email}</span>
              <strong>Total: ₹{order.totalAmount}</strong>
            </div>

            {/* STATUS CONTROL */}
            <div className="order-actions">
              <select
                value={order.status}
                disabled={updatingId === order.id}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value)
                }
              >
                {STATUS_OPTIONS.map(s => (
                  <option
                    key={s}
                    value={s}
                    disabled={!isAllowed(order.status, s)}
                  >
                    {s}
                  </option>
                ))}
              </select>

              {updatingId === order.id && (
                <span className="updating-text">Updating…</span>
              )}
            </div>

            {/* ITEMS */}
            <div className="order-items">
              {order.items?.map(item => (
                <div key={item.id} className="order-item">
                  <span className="item-name">
                    {item.product?.name}
                  </span>
                  <span>Qty: {item.quantity}</span>
                  <span className="item-price">
                    ₹{item.priceAtPurchase}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminOrders;
