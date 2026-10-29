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
      const registerResponse = await fetch("/api/auth/register", {
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
      setError("Email or mobile number and password are required.");
      return;
    }

    if (form.email.toLowerCase() === "admin@pureharvest.com" || form.email.toLowerCase() === "seller@pureharvest.com") {
      setError("Use the dedicated seller or admin login page for those accounts.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/buyer/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.email, password: form.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not send OTP");
      setOtpSent(true);
      if (data.developmentOtp) setOtp(data.developmentOtp);
      setError(data.message || "OTP sent to your registered email address.");
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
      const response = await fetch("/api/auth/buyer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "OTP verification failed");
      login({ token: data.token, email: data.user.email, phone: data.user.phone || "Not provided", name: data.user.name || form.email.split("@")[0], role: "buyer" });
      navigate("/");
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-scene">
        <aside className="auth-visual">
          <div className="auth-visual-glow" />
          <div className="auth-badge-row">
            <span className="auth-pill auth-pill-soft">Organic picks</span>
            <span className="auth-pill">Live now</span>
          </div>

          <div className="auth-visual-card">
            <div className="auth-visual-card-top">
              <span className="auth-mini-dot" />
              <span>PureHarvest</span>
            </div>

            <div className="auth-visual-image" aria-label="Fresh produce reel preview" />

            <div className="auth-visual-bottom">
              <div>
                <p className="auth-kicker">Fresh arrival</p>
                <h3>Farm-picked goodness</h3>
              </div>
              <button type="button" className="auth-cta">Shop now</button>
            </div>
          </div>

          <div className="auth-float-panel auth-float-panel-left">
            <strong>2.4k</strong>
            <span>happy shoppers</span>
          </div>

          <div className="auth-float-panel auth-float-panel-right">
            <strong>4.9/5</strong>
            <span>average rating</span>
          </div>
        </aside>

        <section className="auth-panel">
          <div className="auth-brand-row">
            <span className="brand-mark">🌿</span>
            <div>
              <p className="brand-subtitle">PureHarvest</p>
              <h1>Welcome</h1>
            </div>
          </div>

          <div className="auth-tab-row">
            <button type="button" className={mode === "login" ? "auth-tab active" : "auth-tab"} onClick={() => setMode("login")}>
              Sign in
            </button>
            <button type="button" className={mode === "register" ? "auth-tab active" : "auth-tab"} onClick={() => setMode("register")}>
              Register
            </button>
          </div>

          <div className="auth-copy-block">
            <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p>
              {mode === "login"
                ? "Sign in to continue your healthy routine with organic essentials."
                : "Join the farm-fresh marketplace and enjoy effortless weekly grocery shopping."}
            </p>
          </div>

          {error && (
            <div className={otpSent ? "auth-alert success" : "auth-alert error"}>
              {error}
            </div>
          )}

          {mode === "login" && otpSent ? (
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <label className="auth-field">
                <span>Login OTP</span>
                <input type="text" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter 6-digit OTP" />
              </label>
              <button className="primary-btn auth-submit" type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify and continue"}
              </button>
              <button type="button" className="text-link" onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}>
                Use a different email or mobile number
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span>Email or mobile number</span>
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com or +91 98765 43210"
                />
              </label>

              {mode === "register" && (
                <label className="auth-field">
                  <span>Phone number</span>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                </label>
              )}

              <label className="auth-field">
                <span>Password</span>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
              </label>

              {mode === "register" && (
                <label className="auth-field">
                  <span>Confirm password</span>
                  <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter your password" />
                </label>
              )}

              <button className="primary-btn auth-submit" type="submit" disabled={loading}>
                {mode === "login" ? (loading ? "Sending OTP..." : "Send login OTP") : "Create account"}
              </button>
            </form>
          )}

          <div className="auth-divider"><span>or continue with</span></div>

          <div className="auth-quick-actions">
            <button type="button" className="auth-quick-btn" onClick={handleSellerShortcut}>Seller login</button>
            <button type="button" className="auth-quick-btn secondary" onClick={handleAdminShortcut}>Admin login</button>
          </div>

          <p className="auth-footer-text">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button type="button" className="text-link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>

          <Link to="/" className="auth-back-link">
            Back to shop
          </Link>
        </section>
      </div>
    </div>
  );
}
