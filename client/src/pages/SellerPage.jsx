import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

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
  const { user } = useContext(AuthContext);
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
    <div style={{ background: "linear-gradient(180deg, #f3f8ee 0%, #f9f5ee 100%)", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 20px 40px" }}>
        <section style={{ background: "linear-gradient(135deg, #1d7d48 0%, #3aa467 100%)", borderRadius: "26px", padding: "28px", boxShadow: "0 18px 42px rgba(24, 101, 51, 0.2)", display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: "20px", color: "white", marginBottom: "28px" }}>
          <div>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.14)", color: "white", borderRadius: "999px", padding: "8px 12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.72rem" }}>
              Seller hub
            </span>
            <h2 style={{ margin: "14px 0 10px", fontSize: "2.3rem", lineHeight: 1.1 }}>
              Grow your organic business with smarter selling tools.
            </h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.9)", fontSize: "1rem", lineHeight: 1.7 }}>
              Track inventory, monitor sales, and manage your listings from one dedicated seller workspace.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
              <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 10px", borderRadius: "999px", fontSize: "0.8rem" }}>Inventory updates</span>
              <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 10px", borderRadius: "999px", fontSize: "0.8rem" }}>Order tracking</span>
              <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 10px", borderRadius: "999px", fontSize: "0.8rem" }}>GST ready</span>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "20px", padding: "18px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "14px", fontSize: "1.1rem" }}>Seller profile</h3>
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.8 }}>Seller name</div>
                <strong style={{ fontSize: "1.15rem" }}>{user?.name || "Seller"}</strong>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.8 }}>GST number</div>
                <strong style={{ fontSize: "1.05rem" }}>{user?.gstNumber || "Not provided"}</strong>
              </div>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          {sellerStats.map((item) => (
            <div key={item.label} style={{ background: "#fff", border: "1px solid #eaf0e7", borderRadius: "18px", padding: "18px", boxShadow: "0 12px 24px rgba(0,0,0,0.04)" }}>
              <div style={{ color: "#6b776d", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ marginTop: "12px", fontSize: "1.8rem", fontWeight: 800, color: "#173626" }}>{item.value}</div>
            </div>
          ))}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "20px" }}>
          <div style={{ background: "#fff", border: "1px solid #ebefe9", borderRadius: "20px", padding: "20px", boxShadow: "0 12px 24px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#173626", fontSize: "1.2rem" }}>Your products</h3>
                <span style={{ color: "#6b776d", fontSize: "0.88rem" }}>Keep your catalog fresh and accurate.</span>
              </div>
              <Link to="/" className="secondary-btn" style={{ textDecoration: "none" }}>
                View storefront
              </Link>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              {products.map((item) => (
                <div key={`${item.name}-${item.stock}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", border: "1px solid #edf2ea", borderRadius: "14px", background: "#f9fbf7" }}>
                  <div>
                    <strong style={{ display: "block", color: "#183323" }}>{item.name}</strong>
                    <span style={{ color: "#6b776d", fontSize: "0.82rem" }}>{item.status}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "#183323" }}>{item.stock} units</div>
                    <div style={{ fontSize: "0.8rem", color: "#6b776d" }}>₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #ebefe9", borderRadius: "20px", padding: "20px", boxShadow: "0 12px 24px rgba(0,0,0,0.04)" }}>
            <h3 style={{ margin: "0 0 14px", color: "#173626", fontSize: "1.2rem" }}>Add product</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" style={{ padding: "10px 12px", borderRadius: "12px", border: "1px solid #d7d7d7" }} />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ padding: "10px 12px", borderRadius: "12px", border: "1px solid #d7d7d7" }}>
                <option value="Rice">Rice</option>
                <option value="Fruit">Fruit</option>
                <option value="Pulses">Pulses</option>
                <option value="Oils">Oils</option>
                <option value="Dairy">Dairy</option>
                <option value="Vegetables">Vegetables</option>
              </select>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Quantity" style={{ padding: "10px 12px", borderRadius: "12px", border: "1px solid #d7d7d7" }} />
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" style={{ padding: "10px 12px", borderRadius: "12px", border: "1px solid #d7d7d7" }} />
              <button type="submit" className="primary-btn" style={{ width: "100%", marginTop: "4px" }}>Save product</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
