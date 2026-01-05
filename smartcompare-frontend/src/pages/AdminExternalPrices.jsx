import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminNavbar from "../components/AdminNavbar";

function AdminExternalPrices() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [platform, setPlatform] = useState("");
  const [price, setPrice] = useState("");

  const platforms = [
    "AMAZON",
    "FLIPKART",
    "MEESHO",
    "MYNTRA",
    "NYKAA"
  ];

  // 🔹 Load products
  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔹 Save external price
  const saveExternalPrice = async () => {
    if (!productId || !platform || !price) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/admin/external-prices", null, {
        params: {
          productId,
          platform,
          price
        }
      });

      alert("External price saved successfully ✅");
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Failed to save external price ❌");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div style={styles.container}>
        <h2>Admin – External Platform Prices</h2>

        <div style={styles.card}>
          {/* Product */}
          <select
            value={productId}
            onChange={e => setProductId(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Platform */}
          <select
            value={platform}
            onChange={e => setPlatform(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Platform</option>
            {platforms.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Price */}
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={styles.input}
          />

          <button onClick={saveExternalPrice} style={styles.button}>
            Save Price
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#f5f6fa",
    minHeight: "100vh"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "400px",
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#1e40af",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default AdminExternalPrices;
