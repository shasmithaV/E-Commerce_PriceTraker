import { useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/ComparePage.css";

function ComparePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const products = state?.products || [];

  const [priceHistory, setPriceHistory] = useState({});

  useEffect(() => {
    products.forEach(product => {
      api.get(`/products/${product.id}/price-history`)
        .then(res => {
          const formatted = res.data.map(item => ({
            date: item.changedAt.substring(0, 10),
            price: item.newPrice
          }));

          setPriceHistory(prev => ({
            ...prev,
            [product.id]: formatted
          }));
        })
        .catch(console.error);
    });
  }, [products]);

  if (products.length !== 2) {
    return (
      <>
        <Navbar />
        <p className="compare-warning">
          Please select exactly 2 products to compare.
        </p>
      </>
    );
  }

  return (
    <div className="compare-page">
      <Navbar />

      <div className="compare-content">
        <h2 className="compare-title">Compare Products</h2>

        {/* PRODUCT INFO */}
        <div className="compare-cards">
          {products.map(p => (
            <div key={p.id} className="compare-card">
              <h3>{p.name}</h3>
              <p><b>Brand:</b> {p.brand}</p>
              <p><b>Price:</b> ₹{p.price}</p>
              <p><b>Stock:</b> {p.stock}</p>
            </div>
          ))}
        </div>

        {/* CHART */}
        <div className="compare-chart">
          <h3>Price History</h3>

          <LineChart width={760} height={360}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            {products.map((p, index) => (
              <Line
                key={p.id}
                data={priceHistory[p.id]}
                dataKey="price"
                name={p.name}
                stroke={index === 0 ? "#1e40af" : "#0f172a"}
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </div>

        {/* BACK */}
        <div className="compare-back">
          <button onClick={() => navigate("/products")}>
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComparePage;
