import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function DebugPage() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, usersRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/auth/users", {
            headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
          }),
        ]);

        if (!productsRes.ok || !usersRes.ok) {
          const errorData = await usersRes.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to load data");
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
  }, [user?.token]);

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
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ background: "#f7f9f4", color: "#516159" }}>
                      <th style={{ textAlign: "left", padding: "10px 12px" }}>Name</th>
                      <th style={{ textAlign: "left", padding: "10px 12px" }}>Category</th>
                      <th style={{ textAlign: "left", padding: "10px 12px" }}>Price</th>
                      <th style={{ textAlign: "left", padding: "10px 12px" }}>Units purchased</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id || product.name} style={{ borderBottom: "1px solid #eef1ea" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 700 }}>{product.name}</td>
                        <td style={{ padding: "10px 12px" }}>{product.category || "General"}</td>
                        <td style={{ padding: "10px 12px" }}>₹{Number(product.price || 0)}</td>
                        <td style={{ padding: "10px 12px" }}>{product.purchaseCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="seller-card">
            <h3 className="section-title">Users</h3>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ background: "#f7f9f4", color: "#516159" }}>
                      <th style={{ textAlign: "left", padding: "10px 12px" }}>Name</th>
                      <th style={{ textAlign: "left", padding: "10px 12px" }}>Email</th>
                      <th style={{ textAlign: "left", padding: "10px 12px" }}>Role</th>
                      <th style={{ textAlign: "left", padding: "10px 12px" }}>Phone</th>
                      <th style={{ textAlign: "left", padding: "10px 12px" }}>Latest delivery address</th>
                      <th style={{ textAlign: "left", padding: "10px 12px" }}>GST Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id || user.email} style={{ borderBottom: "1px solid #eef1ea" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 700 }}>{user.name || user.email}</td>
                        <td style={{ padding: "10px 12px" }}>{user.email}</td>
                        <td style={{ padding: "10px 12px" }}>{user.role || "buyer"}</td>
                        <td style={{ padding: "10px 12px" }}>{user.phone || "Not provided"}</td>
                        <td style={{ padding: "10px 12px" }}>{user.latestDelivery?.address ? `${user.latestDelivery.address}${user.latestDelivery.pincode ? `, ${user.latestDelivery.pincode}` : ""}` : "No delivery address yet"}</td>
                        <td style={{ padding: "10px 12px" }}>{user.gstNumber || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
