import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AuthPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", phone: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSellerShortcut = () => {
    navigate("/auth/seller");
  };

  const handleAdminShortcut = () => {
    navigate("/auth/admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (!form.email || !form.phone || !form.password || !form.confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      const registerResponse = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.email.split("@")[0], email: form.email, phone: form.phone, password: form.password, role: "buyer" }),
      });
      const registerData = await registerResponse.json();
      if (!registerResponse.ok) throw new Error(registerData.message || "Registration failed");
      login({ token: registerData.token, email: registerData.user.email, phone: form.phone, name: registerData.user.name, role: "buyer" });
      navigate("/");
      return;
    }

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    if (form.email.toLowerCase() === "admin@pureharvest.com" || form.email.toLowerCase() === "seller@pureharvest.com") {
      setError("Use the dedicated seller or admin login page for those accounts.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/buyer/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not send OTP");
      setOtpSent(true);
      if (data.developmentOtp) setOtp(data.developmentOtp);
      setError(data.message || "OTP sent to your email.");
    } catch (err) {
      setError(err.message || "Could not send OTP");
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
      const response = await fetch("http://localhost:5000/api/auth/buyer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "OTP verification failed");
      login({ email: data.user.email, phone: form.phone || "Not provided", name: data.user.name || form.email.split("@")[0], role: "buyer" });
      navigate("/");
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
              <h1>Account</h1>
            </div>
          </div>
          <Link to="/" className="secondary-btn" style={{ textDecoration: "none" }}>
            Back to shop
          </Link>
        </div>
      </nav>

      <main className="storefront-main" style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        <section className="cart-card" style={{ width: "100%", maxWidth: 460, padding: "28px" }}>
          <div style={{ marginBottom: "18px" }}>
            <h2 className="section-title">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p className="section-subtitle">
              {mode === "login"
                ? "Sign in with your email and secure password."
                : "Register with your email, phone number, and a strong password."}
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: "12px", background: otpSent ? "#e8f6e8" : "#fde8e8", color: otpSent ? "#216e39" : "#b91c1c", padding: "10px 12px", borderRadius: "12px" }}>
              {error}
            </div>
          )}

          {mode === "login" && otpSent ? <form onSubmit={handleVerifyOtp}>
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
          </form> : <form onSubmit={handleSubmit}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }}
              />
            </label>

            {mode === "register" && (
              <label style={{ display: "block", marginBottom: "10px" }}>
                <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Phone number</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }}
                />
              </label>
            )}

            <label style={{ display: "block", marginBottom: "10px" }}>
              <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }}
              />
            </label>

            {mode === "register" && (
              <label style={{ display: "block", marginBottom: "10px" }}>
                <span style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>Confirm password</span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "12px", border: "1px solid #dcd3c5" }}
                />
              </label>
            )}

            <button className="primary-btn" type="submit" style={{ width: "100%", marginTop: "6px" }}>
              {mode === "login" ? (loading ? "Sending OTP..." : "Send login OTP") : "Register"}
            </button>
          </form>}

          <div style={{ marginTop: "14px", textAlign: "center" }}>
            <button
              type="button"
              onClick={handleSellerShortcut}
              style={{
                width: "100%",
                marginBottom: "12px",
                background: "#1d8f56",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "10px 12px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Login as Seller
            </button>
            <button
              type="button"
              onClick={handleAdminShortcut}
              style={{
                width: "100%",
                marginBottom: "12px",
                background: "#0b4d2f",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "10px 12px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Login as Admin
            </button>
            {mode === "login" ? (
              <span>
                New here? <button onClick={() => setMode("register")} style={{ border: "none", background: "none", color: "#2e7d32", fontWeight: 700, cursor: "pointer" }}>Create account</button>
              </span>
            ) : (
              <span>
                Already have an account? <button onClick={() => setMode("login")} style={{ border: "none", background: "none", color: "#2e7d32", fontWeight: 700, cursor: "pointer" }}>Login</button>
              </span>
            )}
          </div>
        </section>

        <section style={{ width: "100%", maxWidth: 980, marginTop: "24px", padding: "22px 18px 12px", borderTop: "1px solid #e5dcca", color: "#465448" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" }}>
            <div>
              <div style={{ fontWeight: 800, color: "#173626", marginBottom: "8px" }}>PureHarvest</div>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Fresh organic groceries delivered from trusted farms to homes with care, quality, and convenience.
              </p>
            </div>

            <div>
              <div style={{ fontWeight: 800, color: "#173626", marginBottom: "8px" }}>Seller login</div>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Grow your local business with PureHarvest. Manage listings, track inventory, and reach more customers through a seamless seller dashboard.
              </p>
            </div>

            <div>
              <div style={{ fontWeight: 800, color: "#173626", marginBottom: "8px" }}>Contact</div>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Email: <a href="mailto:contact@pureharvest.com" style={{ color: "#2e7d32", textDecoration: "none" }}>contact@pureharvest.com</a>
              </p>
            </div>
          </div>

          <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid #ece3d6", fontSize: "0.84rem", color: "#58695e", lineHeight: 1.7 }}>
            © 2026 PureHarvest. All rights reserved. Developed and owned by <strong style={{ color: "#173626" }}>Tulugu Nikhil</strong>.
          </div>
        </section>
      </main>
    </div>
  );
}
