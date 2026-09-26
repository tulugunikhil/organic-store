import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    _id: "1a",
    name: "Sona Masoori Rice",
    description: "Light, fluffy rice ideal for regular family meals and biryani.",
    price: 529,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1604908556855-8d0f8b1c3d13?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "1b",
    name: "Brown Rice",
    description: "Whole-grain rice rich in fiber, nutrients, and a nutty flavor.",
    price: 459,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1604908556855-8d0f8b1c3d13?auto=format&fit=crop&w=800&q=80",
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
    _id: "2a",
    name: "Green Gram",
    description: "Naturally nutritious split green gram for dals and healthy soups.",
    price: 299,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "2b",
    name: "Chickpeas",
    description: "Creamy, fiber-rich chickpeas for hummus, curries, and salads.",
    price: 289,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1519098053891-0c8f18f3fdbb?auto=format&fit=crop&w=800&q=80",
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
    _id: "3a",
    name: "Citrus Oranges",
    description: "Juicy oranges with a bright flavor and refreshing sweetness.",
    price: 349,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "3b",
    name: "Red Apples",
    description: "Crisp, juicy apples with naturally sweet and tangy notes.",
    price: 429,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "3c",
    name: "Alphonso Mangoes",
    description: "Premium seasonal mangoes known for rich aroma and sweetness.",
    price: 699,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
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
    _id: "4a",
    name: "Organic Carrots",
    description: "Sweet and crunchy carrots harvested fresh for everyday cooking.",
    price: 219,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "4b",
    name: "Baby Potatoes",
    description: "Small, buttery potatoes great for roasting and pan-frying.",
    price: 279,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba656?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "4c",
    name: "Bell Peppers",
    description: "Crunchy capsicum for colorful curries, salads, and roasting.",
    price: 259,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "5",
    name: "Cold Pressed Groundnut Oil",
    description: "Rich in aroma and perfect for everyday cooking and tadka.",
    price: 499,
    category: "Oils",
    image: "https://images.unsplash.com/photo-1474978528675-4a50a4508dc3?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "5a",
    name: "Virgin Coconut Oil",
    description: "Smooth, flavorful oil for cooking and wellness routines.",
    price: 579,
    category: "Oils",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "5b",
    name: "Sesame Oil",
    description: "Traditional sesame oil with a deep, nutty flavor.",
    price: 549,
    category: "Oils",
    image: "https://images.unsplash.com/photo-1600335895229-6f7d0f5f7d2e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "6",
    name: "Farm Fresh Milk",
    description: "Creamy, naturally rich milk from trusted local farms.",
    price: 269,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "6a",
    name: "Organic Paneer",
    description: "Soft and protein-packed paneer for curries and snacks.",
    price: 399,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "6b",
    name: "A2 Cow Ghee",
    description: "Pure, aromatic ghee rich in taste and nutrition.",
    price: 649,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1589987607560-6059e79a6a58?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "6c",
    name: "Fresh Curd",
    description: "Slow-set curd for smoothies, meals, and healthy bowls.",
    price: 239,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Storefront() {
  const [products, setProducts] = useState(fallbackProducts);
  const categories = ["Rice", "Fruit", "Pulses", "Oils", "Dairy", "Vegetables"];
  const [timeLeft, setTimeLeft] = useState("03:20:45");
  const [activeDealIndex, setActiveDealIndex] = useState(0);

  const deals = [
    {
      title: "Today's Best Deal",
      subtitle: "Up to 50% off on organic staples",
      accent: "#1d8f56",
      product: "Rice & Pulses",
    },
    {
      title: "Fresh Harvest Pickup",
      subtitle: "Free delivery on vegetables & fruits",
      accent: "#ff8a00",
      product: "Farm Fresh",
    },
    {
      title: "Dairy Delight",
      subtitle: "Save on milk, paneer & curd",
      accent: "#4a7ff5",
      product: "Healthy Dairy",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const [hours, minutes, seconds] = timeLeft.split(":").map(Number);
      let totalSeconds = hours * 3600 + minutes * 60 + seconds;

      if (totalSeconds <= 1) {
        setActiveDealIndex((prev) => (prev + 1) % deals.length);
        totalSeconds = 3 * 3600 + 20 * 60 + 45;
      } else {
        totalSeconds -= 1;
      }

      const nextHours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const nextMinutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const nextSeconds = String(totalSeconds % 60).padStart(2, "0");
      setTimeLeft(`${nextHours}:${nextMinutes}:${nextSeconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, deals.length]);

  const offerCards = [
    { label: "Rice & Grains", value: "Up to 40% OFF", tag: "Today" },
    { label: "Fresh Fruits", value: "Buy 1 Get 1", tag: "Hot" },
    { label: "Organic Oils", value: "Flat ₹150 Off", tag: "New" },
    { label: "Dairy Picks", value: "Combo Saver", tag: "Best Value" },
  ];

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
        <div className="top-spotlight">
          <section
            className="daily-deals-panel"
            style={{
              background: "linear-gradient(135deg, #f5faf2 0%, #fff9ef 100%)",
              borderRadius: "24px",
              border: "1px solid #dfeccf",
              padding: "18px 20px",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <div>
                <span style={{ display: "inline-block", background: "#ffefc9", color: "#8a4e00", borderRadius: "999px", padding: "6px 12px", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Daily deals
                </span>
              </div>
              <div style={{ background: "#1d8f56", color: "white", borderRadius: "12px", padding: "10px 14px", fontWeight: 700 }}>
                Ends in {timeLeft}
              </div>
            </div>

            <div
              style={{
                background: deals[activeDealIndex].accent,
                borderRadius: "20px",
                padding: "22px 20px",
                color: "white",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 18px 35px rgba(29, 143, 86, 0.18)",
                transition: "all 0.5s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.14), transparent 60%)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>
                  {deals[activeDealIndex].product}
                </div>
                <h4 style={{ margin: "12px 0 8px", fontSize: "1.9rem", lineHeight: 1.15 }}>{deals[activeDealIndex].title}</h4>
                <p style={{ margin: 0, fontSize: "1rem", opacity: 0.92 }}>{deals[activeDealIndex].subtitle}</p>
              </div>

              <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginTop: "12px" }}>
                <span style={{ background: "rgba(255,255,255,0.14)", borderRadius: "999px", padding: "8px 12px", fontWeight: 800 }}>
                  Live offer
                </span>
                <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>₹{deals[activeDealIndex].subtitle.includes("50%") ? "799" : "399"}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginTop: "18px" }}>
              {deals.map((deal, index) => {
                const isActive = index === activeDealIndex;
                return (
                  <div
                    key={deal.title}
                    onClick={() => setActiveDealIndex(index)}
                    style={{
                      background: isActive ? "#ffffff" : "#eef7ed",
                      border: isActive ? "1px solid #d9e9d5" : "1px solid #e7eee7",
                      borderRadius: "14px",
                      padding: "12px 14px",
                      cursor: "pointer",
                      boxShadow: isActive ? "0 8px 18px rgba(29, 143, 86, 0.12)" : "none",
                      transform: isActive ? "translateY(-2px)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div style={{ color: isActive ? "#1d8f56" : "#6b776d", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>{deal.product}</div>
                    <div style={{ marginTop: "6px", fontWeight: 800, color: "#1f2d1f" }}>{deal.title}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section
            className="hero-section compact-hero"
            style={{ minHeight: "170px", padding: "12px 14px", display: "flex", alignItems: "center" }}
          >
            <div className="compact-hero-copy" style={{ width: "100%" }}>
              <span className="badge-pill" style={{ background: "rgba(255,255,255,0.16)", color: "white", fontSize: "0.62rem", padding: "5px 8px" }}>
                Fresh from local farms
              </span>
              <h2 className="hero-title" style={{ fontSize: "0.94rem", margin: "8px 0" }}>
                Healthy groceries, delivered with care.
              </h2>
              <p className="hero-copy" style={{ fontSize: "0.68rem", lineHeight: 1.4 }}>
                Discover organic produce, pantry staples, and seasonal favorites in one beautifully curated marketplace.
              </p>
              <div className="hero-tags" style={{ marginTop: "8px", gap: "6px" }}>
                <span className="hero-tag" style={{ fontSize: "0.6rem", padding: "5px 7px" }}>Organic produce</span>
                <span className="hero-tag" style={{ fontSize: "0.6rem", padding: "5px 7px" }}>Same-day delivery</span>
                <span className="hero-tag" style={{ fontSize: "0.6rem", padding: "5px 7px" }}>Local farmers</span>
              </div>
            </div>
          </section>
        </div>

        <div style={{ margin: "20px 0 12px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase()}`}
              className="badge-pill"
              style={{ textDecoration: "none", background: "#edf8eb", color: "#2f5d37" }}
            >
              {category}
            </Link>
          ))}
        </div>

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

        <footer
          style={{
            marginTop: "30px",
            background: "linear-gradient(135deg, #173626 0%, #0f271c 100%)",
            color: "#edf5ee",
            borderRadius: "28px 28px 0 0",
            padding: "28px 28px 20px",
            boxShadow: "0 -18px 35px rgba(18, 41, 28, 0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "26px",
            }}
          >
            {[
              { icon: "🔒", label: "Secure Payment" },
              { icon: "🚚", label: "Fast Delivery" },
              { icon: "✅", label: "Fresh Guarantee" },
              { icon: "💬", label: "24/7 Support" },
            ].map((badge) => (
              <div
                key={badge.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "999px",
                  padding: "8px 14px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#edf5ee",
                }}
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1.2fr",
              gap: "24px",
              alignItems: "start",
            }}
          >
            <div style={{ paddingRight: "8px" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "0.04em", marginBottom: "12px" }}>
                PureHarvest
              </div>
              <p style={{ margin: 0, lineHeight: 1.8, color: "#dfeee2", maxWidth: "360px" }}>
                Fresh, organic groceries sourced from trusted farms and delivered with care, quality, and convenience.
              </p>

              <div style={{ marginTop: "18px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[
                  "Organic",
                  "Same-day",
                  "Local farms",
                ].map((item) => (
                  <span
                    key={item}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "999px",
                      padding: "7px 12px",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      color: "#edf5ee",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, marginBottom: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#f3f9ed" }}>
                Quick links
              </div>
              <div style={{ display: "grid", gap: "10px", color: "#dfeee2" }}>
                {[
                  "Home",
                  "Shop by category",
                  "Daily deals",
                  "Delivery info",
                  "Support center",
                ].map((link) => (
                  <div
                    key={link}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      opacity: 0.95,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.95")}
                  >
                    {link}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, marginBottom: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#f3f9ed" }}>
                Contact
              </div>
              <div style={{ display: "grid", gap: "10px", color: "#dfeee2" }}>
                <div>📞 +91 98765 43210</div>
                <div>✉️ contact@pureharvest.com</div>
                <div>💬 support@pureharvest.com</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, marginBottom: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#f3f9ed" }}>
                Follow us
              </div>
              <div style={{ display: "grid", gap: "10px", color: "#dfeee2" }}>
                {[
                  "Instagram",
                  "Facebook",
                  "WhatsApp",
                  "YouTube",
                ].map((social) => (
                  <div key={social} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ display: "inline-flex", width: "22px", height: "22px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>
                      •
                    </span>
                    <span>{social}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, marginBottom: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#f3f9ed" }}>
                Newsletter
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ color: "#dfeee2", lineHeight: 1.7 }}>
                  Get fresh offers and farm updates in your inbox.
                </div>
                <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "14px", padding: "8px 8px 8px 14px" }}>
                  <input
                    type="email"
                    placeholder="Your email"
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "#edf5ee",
                      fontSize: "0.9rem",
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      border: "none",
                      background: "#f4b942",
                      color: "#173626",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Join
                  </button>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "4px", flexWrap: "wrap" }}>
                  {[
                    "App Store",
                    "Google Play",
                  ].map((store) => (
                    <div
                      key={store}
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "10px",
                        padding: "8px 12px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#edf5ee",
                      }}
                    >
                      {store}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "22px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.15)", color: "#dfeee2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div>📍 PureHarvest Foods Pvt. Ltd., 22 Green Valley Road, Madhapur, Hyderabad, Telangana 500081</div>
              <div>© 2026 PureHarvest. All rights reserved. Developed and owned by Tulugu Nikhil.</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
