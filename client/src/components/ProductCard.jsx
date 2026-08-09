import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [feedback, setFeedback] = useState("");

  const handleAddToCart = () => {
    addToCart(product);
    setFeedback("Product added successfully to the cart");
    window.setTimeout(() => setFeedback(""), 1800);
  };

  return (
    <article className="product-card">
      {feedback && <div className="cart-toast">{feedback}</div>}
      <span className="category-badge">{product.category || "Harvest"}</span>
      <img
        src={product.image || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80"}
        alt={product.name}
        style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "16px", marginTop: "12px" }}
      />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-desc">{product.description}</p>

      <div className="product-footer">
        <span className="product-price">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(Number(product.price))}
        </span>
        <button onClick={handleAddToCart} className="primary-btn">
          Add to cart
        </button>
      </div>
    </article>
  );
}
