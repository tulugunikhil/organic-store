import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function SellerLoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "seller@pureharvest.com", password: "seller123", gstNumber: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.gstNumber) {
      setError("Seller email, password, and GST number are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/seller/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          gstNumber: form.gstNumber,
          role: "seller",
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Could not send OTP");
      setOtpSent(true);
      if (data.developmentOtp) setOtp(data.developmentOtp);
      setError(data.message || "OTP sent to your email.");
    } catch (err) {
      setError(err.message || "Seller login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("Enter the OTP sent to your email.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/seller/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "OTP verification failed");

      login({ token: data.token, email: data.user.email, phone: data.user.phone || "Not provided", name: data.user.name || "Seller", role: "seller", gstNumber: data.user.gstNumber || form.gstNumber });
      navigate("/seller");
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="storefront-shell">
      <nav className="topbar">
        <div className="topbar-inner">
          <div className="brand-block">
            <span className="brand-mark">🌿</span>
            <div>
              <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.2em", color: "#2e7d32", textTransform: "uppercase" }}>PureHarvest</p>
              <h1>Seller Login</h1>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link to="/auth" className="secondary-btn" style={{ textDecoration: "none" }}>
              Buyer login
            </Link>
            <Link to="/auth/admin" className="secondary-btn" style={{ textDecoration: "none" }}>
              Admin login
            </Link>
          </div>
        </div>
      </nav>

      <main className="storefront-main" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
        <section className="cart-card" style={{ width: "100%", maxWidth: 430, padding: "28px" }}>
          <div style={{ marginBottom: "18px" }}>
            <h2 className="section-title">Seller portal</h2>
            <p className="section-subtitle">Manage your catalog, inventory, and orders.</p>
          </div>

          {error && (
            <div style={{ marginBottom: "12px", background: otpSent ? "#e8f6e8" : "#fde8e8", color: otpSent ? "#216e39" : "#b91c1c", padding: "10px 12px", borderRadius: "12px" }}>
              {error}
            </div>
          )}

          {!otpSent ? <form onSubmit={handleSubmit}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Seller email</span>
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

            <label style={{ display: "block", marginBottom: "10px" }}>
              <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>GST number</span>
              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. 27ABCDE1234F2Z5"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }}
              />
            </label>

            <button className="primary-btn" type="submit" style={{ width: "100%", marginTop: "6px" }} disabled={loading}>
              {loading ? "Sending OTP..." : "Send login OTP"}
            </button>
          </form> : <form onSubmit={handleVerifyOtp}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Email OTP</span>
              <input type="text" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter 6-digit OTP" style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }} />
            </label>
            <button className="primary-btn" type="submit" style={{ width: "100%", marginTop: "6px" }} disabled={loading}>
              {loading ? "Verifying..." : "Verify email and login"}
            </button>
            <button type="button" onClick={() => { setOtpSent(false); setOtp(""); setError(""); }} style={{ width: "100%", marginTop: "10px", border: "none", background: "none", color: "#2e7d32", fontWeight: 700, cursor: "pointer" }}>
              Use a different email
            </button>
          </form>}

          <div style={{ marginTop: "14px", fontSize: "0.92rem", color: "#465448" }}>
            Demo seller credentials: <strong>seller@pureharvest.com</strong> / <strong>seller123</strong>. Configure SMTP to receive the OTP by email.
          </div>
        </section>
      </main>
    </div>
  );
}
