import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const fallbackProducts = [
  {
    _id: "1",
    name: "Royal Basmati Rice",
    description: "Fragrant long-grain rice perfect for daily meals and festive dishes.",
    price: 599,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1516684731961-8d1cbf0d0b9f?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "2",
    name: "Organic Red Lentils",
    description: "Protein-rich lentils ideal for soups, curries, and hearty bowls.",
    price: 329,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1574484284002-952d924569dd?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "3",
    name: "Fresh Bananas",
    description: "Naturally sweet bananas packed with potassium and energy.",
    price: 199,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "4",
    name: "Farm Spinach",
    description: "Tender spinach leaves perfect for smoothies, curries, and salads.",
    price: 249,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1576045051382-3c5e9e9d7e55?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "5",
    name: "Chickpeas",
    description: "Creamy, fiber-rich chickpeas for hummus, curries, and salads.",
    price: 289,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1519098053891-0c8f18f3fdbb?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "6",
    name: "Citrus Oranges",
    description: "Juicy oranges with a bright flavor and refreshing sweetness.",
    price: 349,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "7",
    name: "Baby Potatoes",
    description: "Small, buttery potatoes great for roasting and pan-frying.",
    price: 279,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba656?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "8",
    name: "Organic Carrots",
    description: "Sweet and crunchy carrots harvested fresh for everyday cooking.",
    price: 219,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Storefront() {
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(fallbackProducts);
        }
      })
      .catch(() => setProducts(fallbackProducts));
  }, []);

  return (
    <div className="storefront-shell">
      <Navbar />
      <main className="storefront-main">
        <section className="hero-section">
          <div>
            <span className="badge-pill" style={{ background: "rgba(255,255,255,0.16)", color: "white" }}>
              Fresh from local farms
            </span>
            <h2 className="hero-title">Healthy groceries, delivered with care.</h2>
            <p className="hero-copy">
              Discover organic produce, pantry staples, and seasonal favorites in one beautifully curated marketplace.
            </p>
            <div className="hero-tags">
              <span className="hero-tag">Organic produce</span>
              <span className="hero-tag">Same-day delivery</span>
              <span className="hero-tag">Local farmers</span>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80"
              alt="Fresh organic produce"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px" }}
            />
          </div>
        </section>

        <div className="content-grid">
          <div className="products-panel">
            <div className="section-header">
              <div>
                <h3 className="section-title">Featured products</h3>
                <span className="section-subtitle">Hand-picked for your weekly reset.</span>
              </div>
              <span className="badge-pill">New this week</span>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id || product.name} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
