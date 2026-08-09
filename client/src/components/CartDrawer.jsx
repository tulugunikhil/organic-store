import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function CartDrawer() {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <aside className="cart-card">
      <div className="cart-header">
        <div>
          <h2 className="cart-title">Your cart</h2>
          <p style={{ margin: "4px 0 0", color: "#6b776d", fontSize: "0.92rem" }}>Fresh picks ready to checkout</p>
        </div>
        <span className="badge-pill">{cart.length} item{cart.length === 1 ? "" : "s"}</span>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">Your cart is empty. Add a few fresh favorites.</div>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item._id || item.name} className="cart-item">
              <div>
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(Number(item.price))}
                </span>
              </div>
              <button onClick={() => removeFromCart(item._id || item.name)} className="remove-btn">
                Remove
              </button>
            </div>
          ))}
          <Link to="/checkout" className="primary-btn" style={{ display: "inline-block", marginTop: "12px", textDecoration: "none" }}>
            Proceed to checkout
          </Link>
        </div>
      )}
    </aside>
  );
}
