import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/CheckoutPage.css";

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/cart")
      .then(res => {
        setCartItems(res.data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      await api.post("/orders");
      alert("Order placed successfully ✅");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to place order ❌");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="checkout-status">Loading checkout…</p>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <p className="checkout-status">Your cart is empty</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <div className="checkout-card">
          <h2 className="checkout-title">Checkout</h2>

          {/* ITEMS */}
          <div className="checkout-items">
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <span className="item-name">{item.product.name}</span>
                <span className="item-qty">× {item.quantity}</span>
                <span className="item-price">
                  ₹{item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="checkout-total">
            <span>Total Amount</span>
            <strong>₹{totalAmount}</strong>
          </div>

          {/* ACTION */}
          <button className="place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
        
      </div>
    </>
  );
}

export default CheckoutPage;
