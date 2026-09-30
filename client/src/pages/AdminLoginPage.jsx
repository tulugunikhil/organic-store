import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminLoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@pureharvest.com", password: "admin123" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    if (form.email.toLowerCase() !== "admin@pureharvest.com" || form.password !== "admin123") {
      setError("Admin credentials are invalid. Use admin@pureharvest.com / admin123");
      return;
    }

    login({
      email: form.email,
      phone: "Not provided",
      name: "Admin",
      role: "admin",
    });

    navigate("/dashboard");
  };

  return (
    <div className="storefront-shell">
      <nav className="topbar">
        <div className="topbar-inner">
          <div className="brand-block">
            <span className="brand-mark">🌿</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.2em", color: "#2e7d32", textTransform: "uppercase" }}>PureHarvest</p>
              <h1>Admin Login</h1>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link to="/auth" className="secondary-btn" style={{ textDecoration: "none" }}>
              User login
            </Link>
            <Link to="/" className="secondary-btn" style={{ textDecoration: "none" }}>
              Back to shop
            </Link>
          </div>
        </div>
      </nav>

      <main className="storefront-main" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
        <section className="cart-card" style={{ width: "100%", maxWidth: 430, padding: "28px" }}>
          <div style={{ marginBottom: "18px" }}>
            <h2 className="section-title">Admin portal</h2>
            <p className="section-subtitle">Secure sign-in for store administrators and managers.</p>
          </div>

          {error && (
            <div style={{ marginBottom: "12px", background: "#fde8e8", color: "#b91c1c", padding: "10px 12px", borderRadius: "12px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Admin email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }}
              />
            </label>

            <label style={{ display: "block", marginBottom: "10px" }}>
              <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }}
              />
            </label>

            <button className="primary-btn" type="submit" style={{ width: "100%", marginTop: "6px" }}>
              Login as Admin
            </button>
          </form>

          <div style={{ marginTop: "14px", fontSize: "0.92rem", color: "#465448" }}>
            Demo admin credentials: <strong>admin@pureharvest.com</strong> / <strong>admin123</strong>
          </div>
        </section>
      </main>
    </div>
  );
}
