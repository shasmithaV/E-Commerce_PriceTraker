import { useEffect, useState } from "react";
import api from "../api/axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import "../styles/ComparePopup.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function ComparePopup({ onClose }) {
  const [productName, setProductName] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const allPlatforms = ["AMAZON", "FLIPKART", "MEESHO", "MYNTRA", "NYKAA"];

  const PLATFORM_COLORS = {
    "OUR STORE": "#1e40af",
    AMAZON: "#f59e0b",
    FLIPKART: "#2563eb",
    MEESHO: "#ec4899",
    MYNTRA: "#10b981",
    NYKAA: "#8b5cf6",
  };

  /* ================= LOAD PRODUCT NAMES ================= */
  useEffect(() => {
    api.get("/products")
      .then(res => setAllProducts(res.data.map(p => p.name)))
      .catch(console.error);
  }, []);

  /* ================= HELPERS ================= */
  const togglePlatform = (p) => {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const compare = async () => {
    if (!productName || platforms.length === 0) {
      alert("Enter product name and select platforms");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/compare", {
        params: { productName, platforms }
      });
      setResult(res.data);
    } catch {
      alert("Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PRICE LOGIC ================= */
  const allPrices = result
    ? [
        { platform: "OUR STORE", price: result.ourPrice },
        ...result.comparisons
      ]
    : [];

  const cheapest = allPrices.length
    ? Math.min(...allPrices.map(p => p.price))
    : null;

  const percentDiff = (price) =>
    cheapest ? (((price - cheapest) / cheapest) * 100).toFixed(1) : 0;

  /* ================= CHART ================= */
  const chartData = result && {
    labels: ["OUR STORE", ...result.comparisons.map(c => c.platform)],
    datasets: [
      {
        label: "Price (₹)",
        data: [result.ourPrice, ...result.comparisons.map(c => c.price)],
        backgroundColor: ["OUR STORE", ...result.comparisons.map(c => c.platform)]
          .map(p => PLATFORM_COLORS[p]),
        borderRadius: 6,
      }
    ]
  };

  return (
    <div className="compare-overlay">
      <div className="compare-modal">
        {/* HEADER */}
        <div className="compare-header">
          <h2>Compare Prices</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* SEARCH */}
        <div className="field-group">
          <input
            placeholder="Search product name"
            value={productName}
            onChange={(e) => {
              const value = e.target.value;
              setProductName(value);

              if (!value) {
                setSuggestions([]);
                return;
              }

              setSuggestions(
                allProducts
                  .filter(p =>
                    p.toLowerCase().startsWith(value.toLowerCase())
                  )
                  .slice(0, 5)
              );
            }}
          />

          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => {
                    setProductName(s);
                    setSuggestions([]);
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PLATFORMS */}
        <div className="platforms">
          {allPlatforms.map(p => (
            <label
              key={p}
              className={`platform-chip ${
                platforms.includes(p) ? "active" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={platforms.includes(p)}
                onChange={() => togglePlatform(p)}
              />
              {p}
            </label>
          ))}
        </div>

        {/* BUTTON */}
        <button
          className="compare-btn"
          onClick={compare}
          disabled={loading}
        >
          {loading ? "Comparing…" : "Compare Prices"}
        </button>

        {/* LOADING SKELETON */}
        {loading && <div className="chart-skeleton" />}

        {/* RESULT */}
        {!loading && result && (
          <div className="compare-result">
            <div className="our-price">
              Our Price: <strong>₹{result.ourPrice}</strong>
              {result.ourPrice === cheapest && (
                <span className="best-badge">Best Price</span>
              )}
            </div>

            <Bar data={chartData} />

            <div className="price-diff-list">
              {allPrices.map(p => (
                <div key={p.platform} className="price-diff-item">
                  <span>{p.platform}</span>
                  {p.price === cheapest ? (
                    <span className="best-text">Cheapest</span>
                  ) : (
                    <span className="diff-text">
                      +{percentDiff(p.price)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparePopup;
