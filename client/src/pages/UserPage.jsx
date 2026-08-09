import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const orders = [
  { id: "ORD-1001", item: "Organic Tomatoes", status: "Delivered" },
  { id: "ORD-1002", item: "Farm Eggs", status: "On the way" },
];

const wishlist = ["Fresh Basil", "Honeycrisp Apples", "Wildflower Honey"];

export default function UserPage() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="storefront-shell">
        <nav className="topbar">
          <div className="topbar-inner">
            <div className="brand-block">
              <span className="brand-mark">🌿</span>
              <div>
                <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.2em", color: "#2e7d32", textTransform: "uppercase" }}>PureHarvest</p>
                <h1>Profile</h1>
              </div>
            </div>
            <Link to="/auth" className="secondary-btn" style={{ textDecoration: "none" }}>
              Login
            </Link>
          </div>
        </nav>
        <main className="storefront-main">
          <div className="cart-card" style={{ maxWidth: 560, margin: "0 auto", padding: "24px" }}>
            <h2 className="section-title">Please sign in</h2>
            <p className="section-subtitle">Your profile details will appear here after login.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="storefront-shell">
      <nav className="topbar">
        <div className="topbar-inner">
          <div className="brand-block">
            <span className="brand-mark">🌿</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.2em", color: "#2e7d32", textTransform: "uppercase" }}>PureHarvest</p>
              <h1>Profile</h1>
            </div>
          </div>
          <Link to="/" className="secondary-btn" style={{ textDecoration: "none" }}>
            Back to shop
          </Link>
        </div>
      </nav>

      <main className="storefront-main">
        <section className="cart-card" style={{ padding: "24px", marginBottom: "18px" }}>
          <h2 className="section-title">{user.name || user.email}</h2>
          <p className="section-subtitle">Email: {user.email}</p>
          <p className="section-subtitle">Phone: {user.phone || "Not provided"}</p>
        </section>

        <div className="content-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <section className="cart-card" style={{ padding: "20px" }}>
            <h3 className="section-title">Orders</h3>
            <div style={{ marginTop: "10px" }}>
              {orders.map((order) => (
                <div key={order.id} className="cart-item" style={{ display: "block" }}>
                  <strong>{order.id}</strong>
                  <div className="cart-item-price">{order.item}</div>
                  <div className="cart-item-price">Status: {order.status}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="cart-card" style={{ padding: "20px" }}>
            <h3 className="section-title">Wishlist</h3>
            <div style={{ marginTop: "10px" }}>
              {wishlist.map((item) => (
                <div key={item} className="cart-item">
                  <span className="cart-item-name">{item}</span>
                  <span className="cart-item-price">Saved</span>
                </div>
              ))}
            </div>
          </section>

          <section className="cart-card" style={{ padding: "20px" }}>
            <h3 className="section-title">Payment & address</h3>
            <div style={{ marginTop: "10px" }}>
              <div className="cart-item" style={{ display: "block" }}>
                <strong>Payment</strong>
                <div className="cart-item-price">Visa ending in 4821</div>
              </div>
              <div className="cart-item" style={{ display: "block" }}>
                <strong>Address</strong>
                <div className="cart-item-price">123 Green Street, Springfield</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
