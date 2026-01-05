import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/OrdersPage.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my")
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="orders-loading">Loading orders...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="orders-page">
        <h2 className="orders-title">My Orders</h2>

        {orders.length === 0 && (
          <p className="no-orders">You haven’t placed any orders yet.</p>
        )}

        {orders.map(order => (
          <div key={order.id} className="order-card">
            {/* HEADER */}
            <div className="order-header">
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

            {/* SUMMARY */}
            <div className="order-summary">
              <span>Total Amount</span>
              <strong>₹{order.totalAmount}</strong>
            </div>

            {/* ITEMS */}
            <div className="order-items">
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <span className="item-name">{item.product.name}</span>
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

export default OrdersPage;
