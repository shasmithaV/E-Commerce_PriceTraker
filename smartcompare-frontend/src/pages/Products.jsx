import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import "../styles/Products.css";
import ComparePopup from "../components/ComparePopup";

function Products() {
  const [products, setProducts] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompare, setShowCompare] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  // 🔹 Fetch products
  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("API ERROR:", err))
      .finally(() => setLoading(false));
  }, []);
  const handleSearchChange = (value) => {
  setSearch(value);

  if (!value.trim()) {
    setSuggestions([]);
    return;
  }

  const filtered = products
    .map(p => p.name)
    .filter(name =>
      name.toLowerCase().startsWith(value.toLowerCase())
    );

  setSuggestions([...new Set(filtered)].slice(0, 5));
};

  // 🔹 Add to cart
  const handleAddToCart = (product) => {
    api.post("/cart/add", null, {
      params: { productId: product.id, quantity: 1 }
    })
    .then(() => {
      alert("Added to cart"); // can replace with toast later
    })
    .catch(() => {
      alert("Failed to add to cart");
    });
  };

  // 🔹 Compare handler
  const handleCompare = (product, checked) => {
    if (checked) {
      if (compareList.length === 2) {
        alert("You can compare only 2 products");
        return;
      }
      setCompareList([...compareList, product]);
    } else {
      setCompareList(compareList.filter(p => p.id !== product.id));
    }
  };

  // 🔹 Navigate to compare
  const goToCompare = () => {
    navigate("/compare", { state: { products: compareList } });
  };
  const displayedProducts = search
  ? products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
  : products;

  return (
    <div className="products-page">
      <Navbar />

      {/* HEADER */}
      <div className="products-header">
  <h1>Products</h1>
  <p>Browse and compare the latest items</p>

  {/* SEARCH */}
  <div className="product-search">
    <input
      type="text"
      placeholder="Search products…"
      value={search}
      onChange={(e) => handleSearchChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setSuggestions([]);
        }
      }}
    />

    {suggestions.length > 0 && (
      <div className="search-suggestions">
        {suggestions.map((name, idx) => (
          <div
            key={idx}
            className="suggestion-item"
            onClick={() => {
              setSearch(name);
              setSuggestions([]);
            }}
          >
            {name}
          </div>
        ))}
      </div>
    )}
  </div>

  {showCompare && (
    <ComparePopup onClose={() => setShowCompare(false)} />
  )}
</div>


      {/* CONTENT */}
      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="loading-text">No products available</p>
      ) : (
        <div className="products-grid">
          {displayedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onCompare={handleCompare}
            />
          ))}
        </div>
      )}

      {/* STICKY COMPARE BAR */}
      {compareList.length === 2 && (
        <div className="compare-bar">
          <span>2 products selected for comparison</span>
          <button onClick={goToCompare}>Compare Now</button>
        </div>
      )}

      {/* FLOATING COMPARE BUTTON */}
<button
  className="compare-float-btn"
  onClick={() => setShowCompare(true)}
>
  Compare Prices
</button>

{showCompare && (
  <ComparePopup onClose={() => setShowCompare(false)} />
)}

    </div>
  );
}

export default Products;
