import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const navigate = useNavigate();

  const fetchCart = () => {
    api.get("/cart")
      .then(res => setCartItems(res.data.items || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQty = (productId) => {
    api.post("/cart/add", { productId, quantity: 1 }).then(fetchCart);
  };

  const decreaseQty = (productId, qty) => {
    if (qty <= 1) return;
    api.post("/cart/add", { productId, quantity: -1 }).then(fetchCart);
  };

  const removeItem = (productId) => {
    api.delete("/cart/remove", { params: { productId } }).then(fetchCart);
  };

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-container">
        <h2 className="cart-title">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="empty-cart">Your cart is empty 🛒</div>
        ) : (
          <>
            {cartItems.map(item => (
              <div key={item.id} className="cart-card">
                <div className="cart-info">
                  <h4>{item.product.name}</h4>
                  <p className="price">₹{item.product.price}</p>

                  <div className="qty-row">
                    <button onClick={() => decreaseQty(item.product.id, item.quantity)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.product.id)}>+</button>
                  </div>

                  <p className="item-total">
                    Item Total: ₹{item.product.price * item.quantity}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.product.id)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="cart-summary">
              <div>
                <h3>Subtotal ({cartItems.length} items)</h3>
                <h2>₹{grandTotal}</h2>
              </div>

              <button
              className="checkout-btn"
              disabled={processingCheckout}
              onClick={() => {
                setProcessingCheckout(true);

                setTimeout(() => {
                navigate("/checkout");
                }, 600); // small delay for smooth UX
               }}>
               {processingCheckout ? "Preparing checkout..." : "Proceed to Checkout"}
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
