import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DebugPage() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, usersRes] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/auth/users"),
        ]);

        if (!productsRes.ok || !usersRes.ok) {
          throw new Error("Failed to load data");
        }

        const [productsData, usersData] = await Promise.all([productsRes.json(), usersRes.json()]);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        setError(err.message || "Unable to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="storefront-shell">
      <nav className="topbar">
        <div className="topbar-inner">
          <div className="brand-block">
            <span className="brand-mark">🛠️</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.2em", color: "#2e7d32", textTransform: "uppercase" }}>PureHarvest</p>
              <h1>Debug</h1>
            </div>
          </div>
          <Link to="/" className="secondary-btn" style={{ textDecoration: "none" }}>
            Back to shop
          </Link>
        </div>
      </nav>

      <main className="storefront-main">
        <section className="seller-card" style={{ marginBottom: "20px" }}>
          <h2 className="section-title">Saved data</h2>
          <p className="section-subtitle">View the products and users currently stored in the backend.</p>
        </section>

        {loading && <p>Loading data...</p>}
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

        <div className="seller-grid">
          <section className="seller-card">
            <h3 className="section-title">Products</h3>
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="seller-list">
                {products.map((product) => (
                  <div key={product._id || product.name} className="seller-list-item">
                    <div>
                      <strong>{product.name}</strong>
                      <p>{product.category || "General"}</p>
                    </div>
                    <span>₹{Number(product.price || 0)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="seller-card">
            <h3 className="section-title">Users</h3>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="seller-list">
                {users.map((user) => (
                  <div key={user._id || user.email} className="seller-list-item">
                    <div>
                      <strong>{user.name || user.email}</strong>
                      <p>{user.email}</p>
                    </div>
                    <span>{user.role || "buyer"}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
