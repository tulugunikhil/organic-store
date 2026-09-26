import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const initialProducts = [
  { name: "Royal Basmati Rice", category: "Rice", status: "In stock", stock: 120, price: 599 },
  { name: "Organic Red Lentils", category: "Pulses", status: "Low stock", stock: 35, price: 329 },
  { name: "Fresh Bananas", category: "Fruit", status: "In stock", stock: 80, price: 199 },
  { name: "Farm Spinach", category: "Vegetables", status: "Fresh arrival", stock: 45, price: 249 },
];

const sellerStats = [
  { label: "Active listings", value: "24" },
  { label: "Pending orders", value: "8" },
  { label: "Today's revenue", value: "₹18,400" },
  { label: "Stock health", value: "Good" },
];

export default function SellerPage() {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({ name: "", category: "Rice", stock: "", price: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.stock || !form.price) return;

    const newProduct = {
      name: form.name,
      category: form.category,
      status: Number(form.stock) > 20 ? "In stock" : "Low stock",
      stock: Number(form.stock),
      price: Number(form.price),
    };

    setProducts((prev) => [newProduct, ...prev]);
    setForm({ name: "", category: "Rice", stock: "", price: "" });
  };

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
              {products.map((item) => (
                <div key={`${item.name}-${item.stock}`} className="seller-list-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.status}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>{item.stock} units</div>
                    <div style={{ fontSize: "0.8rem", color: "#6b776d" }}>₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="seller-card">
            <h3 className="section-title">Add product</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
                style={{ padding: "10px 12px", borderRadius: "12px", border: "1px solid #d7d7d7" }}
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ padding: "10px 12px", borderRadius: "12px", border: "1px solid #d7d7d7" }}
              >
                <option value="Rice">Rice</option>
                <option value="Fruit">Fruit</option>
                <option value="Pulses">Pulses</option>
                <option value="Oils">Oils</option>
                <option value="Dairy">Dairy</option>
                <option value="Vegetables">Vegetables</option>
              </select>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="Quantity"
                style={{ padding: "10px 12px", borderRadius: "12px", border: "1px solid #d7d7d7" }}
              />
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Price"
                style={{ padding: "10px 12px", borderRadius: "12px", border: "1px solid #d7d7d7" }}
              />
              <button
                type="submit"
                className="primary-btn"
                style={{ width: "100%", marginTop: "4px" }}
              >
                Save product
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
