import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <div className="brand-block">
          <span className="brand-mark">🌿</span>
          <div>
            <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.2em", color: "#2e7d32", textTransform: "uppercase" }}>PureHarvest</p>
            <h1>Marketplace</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <Link to="/seller" className="secondary-btn" style={{ textDecoration: "none" }}>
            Seller Page
          </Link>
          <span className="badge-pill">Cart ({cart.length})</span>
          {user ? (
            <>
              <Link to="/user" className="badge-pill" style={{ textDecoration: "none" }}>
                {user.email}
              </Link>
              <button onClick={logout} className="secondary-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="secondary-btn" style={{ textDecoration: "none" }}>
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
