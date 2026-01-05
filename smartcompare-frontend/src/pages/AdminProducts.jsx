import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL | LOW_STOCK
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 6;
  const filteredProducts = products.filter(p => {
  const matchesSearch =
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase());

  const matchesFilter =
    filter === "ALL" ||
    (filter === "LOW_STOCK" && p.stock <= 5);

  return matchesSearch && matchesFilter;
});
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
  start,
  start + ITEMS_PER_PAGE
);
  
  


  useEffect(() => {
    api.get("/products")
      .then(res => {
        const enriched = res.data.map(p => ({
          ...p,
          originalPrice: p.price,
          originalStock: p.stock,
        }));
        setProducts(enriched);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
  setPage(1);
}, [search, filter]);


  const hasChanges = (p) =>
    Number(p.price) !== p.originalPrice ||
    Number(p.stock) !== p.originalStock;

  const isLowStock = (stock) => stock <= 5;

  const updateProduct = async (product) => {
    try {
      setUpdatingId(product.id);

      await api.put(`/admin/products/${product.id}`, {
        price: Number(product.price),
        stock: Number(product.stock),
      });

      setProducts(prev =>
        prev.map(x =>
          x.id === product.id
            ? {
                ...x,
                originalPrice: Number(product.price),
                originalStock: Number(product.stock),
              }
            : x
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <p className="admin-products-loading">Loading products…</p>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <div className="admin-products-page">
        <h2 className="admin-products-title">Manage Products</h2>
        <div className="admin-toolbar">
  <div className="search-box">
    <input
      type="text"
      placeholder="Search products or brands"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <div className="filter-box">
    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
      <option value="ALL">All Products</option>
      <option value="LOW_STOCK">Low Stock</option>
    </select>
  </div>
</div>      

        {/* COLUMN HEADER */}
        <div className="product-header">
          <span>Product</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Action</span>
        </div>

        {paginatedProducts.map(p => (
          <div key={p.id} className="product-row">
            {/* PRODUCT INFO */}
            <div className="product-info">
              <h4>{p.name}</h4>
              <p>{p.brand}</p>
              {isLowStock(p.stock) && (
                <span className="low-stock-badge">Low stock</span>
              )}
            </div>

            {/* PRICE */}
            <input
              type="number"
              value={p.price}
              onChange={(e) =>
                setProducts(prev =>
                  prev.map(x =>
                    x.id === p.id
                      ? { ...x, price: e.target.value }
                      : x
                  )
                )
              }
            />

            {/* STOCK */}
            <input
              type="number"
              value={p.stock}
              onChange={(e) =>
                setProducts(prev =>
                  prev.map(x =>
                    x.id === p.id
                      ? { ...x, stock: e.target.value }
                      : x
                  )
                )
              }
            />

            {/* ACTION */}
            <button
              className="update-btn"
              disabled={!hasChanges(p) || updatingId === p.id}
              onClick={() => updateProduct(p)}
            >
              {updatingId === p.id ? "Updating…" : "Update"}
            </button>
          </div>
        ))}

        <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          >Prev
        </button>

      <span>Page {page}</span>

        <button
        disabled={start + ITEMS_PER_PAGE >= filteredProducts.length}
        onClick={() => setPage(p => p + 1)}
        >
          Next
            </button>
        </div>
        
      </div>


    </>
  );
}

export default AdminProducts;
