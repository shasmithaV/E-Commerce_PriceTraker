import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import "../styles/PriceHistory.css";

function PriceHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}/price-history`)
      .then(res => setHistory(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="price-history-page">
      <div className="price-history-card">
        <h2>Price History</h2>
        <p className="subtitle">
          Track how the price has changed over time
        </p>

        {loading ? (
          <p className="status-text">Loading price history...</p>
        ) : history.length === 0 ? (
          <p className="status-text">No price history available</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {history.map(h => (
                <tr key={h.id}>
                  <td>{new Date(h.date).toLocaleDateString()}</td>
                  <td className="price">₹{h.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PriceHistory;
