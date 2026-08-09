import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const sellerStats = [
  { label: "Active listings", value: "24" },
  { label: "Pending orders", value: "8" },
  { label: "Today's revenue", value: "₹18,400" },
  { label: "Stock health", value: "Good" },
];

const sellerProducts = [
  { name: "Royal Basmati Rice", status: "In stock", stock: "120 kg" },
  { name: "Organic Red Lentils", status: "Low stock", stock: "35 kg" },
  { name: "Fresh Bananas", status: "In stock", stock: "80 bunches" },
  { name: "Farm Spinach", status: "Fresh arrival", stock: "45 bundles" },
];

export default function SellerPage() {
  return (
    <div className="storefront-shell">
      <Navbar />
      <main className="storefront-main">
        <section className="seller-hero">
          <div>
            <span className="badge-pill" style={{ background: "rgba(255,255,255,0.16)", color: "white" }}>
              Seller hub
            </span>
            <h2 className="hero-title" style={{ color: "white" }}>
              Run your fresh produce business from one simple dashboard.
            </h2>
            <p className="hero-copy">
              Track stock, manage pricing, and stay on top of customer orders without switching between tools.
            </p>
            <div className="hero-tags">
              <span className="hero-tag">Inventory updates</span>
              <span className="hero-tag">Order tracking</span>
              <span className="hero-tag">Daily insights</span>
            </div>
          </div>

          <div className="seller-hero-card">
            <h3 className="section-title" style={{ marginTop: 0 }}>Today’s snapshot</h3>
            <div className="seller-stat-grid">
              {sellerStats.map((item) => (
                <div key={item.label} className="seller-stat-box">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="seller-grid">
          <div className="seller-card">
            <div className="section-header">
              <div>
                <h3 className="section-title">Your products</h3>
                <span className="section-subtitle">Keep your catalog fresh and accurate.</span>
              </div>
              <Link to="/" className="secondary-btn" style={{ textDecoration: "none" }}>
                View storefront
              </Link>
            </div>

            <div className="seller-list">
              {sellerProducts.map((item) => (
                <div key={item.name} className="seller-list-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.status}</p>
                  </div>
                  <span>{item.stock}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="seller-card">
            <h3 className="section-title">Quick actions</h3>
            <ul className="seller-actions">
              <li>Upload new produce listings</li>
              <li>Update prices for seasonal items</li>
              <li>Review incoming customer orders</li>
              <li>Share delivery updates with buyers</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
