import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Checkout() {
  const { cart, removeFromCart } = useContext(CartContext);
  const [form, setForm] = useState({ name: "", address: "", card: "" });
  const [submitted, setSubmitted] = useState(false);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + Number(item.price || 0), 0);
  }, [cart]);

  const deliveryFee = cart.length > 0 ? 399 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="storefront-shell">
      <nav className="topbar">
        <div className="topbar-inner">
          <div className="brand-block">
            <span className="brand-mark">🌿</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.2em", color: "#2e7d32", textTransform: "uppercase" }}>PureHarvest</p>
              <h1>Checkout</h1>
            </div>
          </div>
          <Link to="/" className="secondary-btn" style={{ textDecoration: "none" }}>
            Back to shop
          </Link>
        </div>
      </nav>

      <main className="storefront-main">
        <div className="content-grid" style={{ gridTemplateColumns: "1.1fr 0.9fr" }}>
          <section className="cart-card" style={{ padding: "24px" }}>
            <h2 className="section-title">Delivery details</h2>
            <p className="section-subtitle">We’ll bring your organic order to your doorstep.</p>

            <form onSubmit={handleSubmit} style={{ marginTop: "18px" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }}
                />
              </label>

              <label style={{ display: "block", marginBottom: "10px" }}>
                <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Address</span>
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }}
                />
              </label>

              <label style={{ display: "block", marginBottom: "10px" }}>
                <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Card</span>
                <input
                  required
                  value={form.card}
                  onChange={(e) => setForm({ ...form, card: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }}
                />
              </label>

              <button className="primary-btn" type="submit" style={{ width: "100%", marginTop: "6px" }}>
                Place order
              </button>
            </form>

            {submitted && (
              <div style={{ marginTop: "16px", background: "#edf8eb", borderRadius: "14px", padding: "12px", color: "#246b35", fontWeight: 700 }}>
                Thanks, {form.name || "friend"}! Your organic order is confirmed.
              </div>
            )}
          </section>

          <aside className="cart-card" style={{ padding: "24px" }}>
            <h3 className="section-title">Order summary</h3>
            <p className="section-subtitle">Review your basket before payment.</p>

            {cart.length === 0 ? (
              <div className="cart-empty" style={{ marginTop: "14px" }}>Your cart is empty.</div>
            ) : (
              <div style={{ marginTop: "14px" }}>
                {cart.map((item) => (
                  <div key={item._id || item.name} className="cart-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="cart-item-name">{item.name}</span>
                      <button onClick={() => removeFromCart(item._id || item.name)} className="remove-btn">
                        Remove
                      </button>
                    </div>
                    <span className="cart-item-price">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(Number(item.price))}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: "18px", borderTop: "1px solid #eee2c8", paddingTop: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>Subtotal</span>
                <strong>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(subtotal)}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span>Delivery</span>
                <strong>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(deliveryFee)}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", fontWeight: 800 }}>
                <span>Total</span>
                <strong>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(total)}
                </strong>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
