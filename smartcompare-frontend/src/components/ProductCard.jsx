import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/ProductCard.css";

function ProductCard({ product, onCompare }) {
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      await api.post("/cart/add", {
        productId: product.id,
        quantity: 1,
      });
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed", error);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="product-card">
      {/* TOP */}
      <div className="product-card-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>

        <p className="product-price">
          ₹{product.price}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="product-actions">
        <button className="add-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>

        <label className="compare-option">
          <input
            type="checkbox"
            onChange={(e) => onCompare(product, e.target.checked)}
          />
          <span>Compare</span>
        </label>
      </div>
    </div>
  );
}

export default ProductCard;
