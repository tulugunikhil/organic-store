import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

const categorySeeds = [
  {
    _id: "rice-1",
    name: "Royal Basmati Rice",
    description: "Aromatic long-grain rice for daily meals and festive dishes.",
    price: 599,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1516684731961-8d1cbf0d0b9f?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "rice-2",
    name: "Brown Rice",
    description: "Nutritious whole grain rice with a rich earthy flavor.",
    price: 459,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "rice-3",
    name: "Sona Masoori Rice",
    description: "Soft, fluffy rice suited for everyday meals and biryani.",
    price: 529,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "rice-4",
    name: "Organic Jasmine Rice",
    description: "Fragrant and premium rice for elegant family meals.",
    price: 639,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "fruit-1",
    name: "Fresh Bananas",
    description: "Naturally sweet bananas packed with potassium and fiber.",
    price: 199,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "fruit-2",
    name: "Citrus Oranges",
    description: "Juicy oranges with bright flavor and refreshing sweetness.",
    price: 349,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "fruit-3",
    name: "Red Apples",
    description: "Crisp, juicy apples with a naturally sweet bite.",
    price: 429,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "fruit-4",
    name: "Alphonso Mangoes",
    description: "Premium mangoes known for rich aroma and sweetness.",
    price: 699,
    category: "Fruit",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "pulse-1",
    name: "Organic Red Lentils",
    description: "Protein-rich lentils ideal for soups, curries, and bowls.",
    price: 329,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1574484284002-952d924569dd?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "pulse-2",
    name: "Chickpeas",
    description: "Creamy, fiber-rich chickpeas for hummus and curries.",
    price: 289,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1519098053891-0c8f18f3fdbb?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "pulse-3",
    name: "Green Gram",
    description: "Nutritious split green gram made for wholesome dals.",
    price: 299,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "pulse-4",
    name: "Black Eyed Beans",
    description: "Protein-packed beans ideal for curries and salads.",
    price: 339,
    category: "Pulses",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "oil-1",
    name: "Cold Pressed Groundnut Oil",
    description: "Rich in aroma and perfect for everyday cooking.",
    price: 499,
    category: "Oils",
    image: "https://images.unsplash.com/photo-1474978528675-4a50a4508dc3?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "oil-2",
    name: "Virgin Coconut Oil",
    description: "Smooth, flavorful oil for cooking and wellness routines.",
    price: 579,
    category: "Oils",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "oil-3",
    name: "Sesame Oil",
    description: "Traditional sesame oil with a deep, nutty flavor.",
    price: 549,
    category: "Oils",
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "oil-4",
    name: "Extra Virgin Olive Oil",
    description: "Light, healthy oil for salads and daily cooking.",
    price: 699,
    category: "Oils",
    image: "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "dairy-1",
    name: "Farm Fresh Milk",
    description: "Creamy, naturally rich milk from trusted local farms.",
    price: 269,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "dairy-2",
    name: "Organic Paneer",
    description: "Soft and protein-packed paneer for curries and snacks.",
    price: 399,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1f7f4d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "dairy-3",
    name: "A2 Cow Ghee",
    description: "Pure, aromatic ghee rich in taste and nutrition.",
    price: 649,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1589987607560-6059e79a6a58?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "dairy-4",
    name: "Fresh Curd",
    description: "Slow-set curd for smoothies, meals, and healthy bowls.",
    price: 239,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "veg-1",
    name: "Farm Spinach",
    description: "Tender leaves packed with minerals and freshness.",
    price: 249,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1576045051382-3c5e9e9d7e55?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "veg-2",
    name: "Organic Carrots",
    description: "Sweet, crunchy carrots harvested fresh for daily cooking.",
    price: 219,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "veg-3",
    name: "Bell Peppers",
    description: "Crunchy capsicum ideal for salads and quick stir-fries.",
    price: 259,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "veg-4",
    name: "Cauliflower",
    description: "Fresh, firm cauliflower perfect for curries and roasting.",
    price: 279,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=800&q=80",
  },
];

const normalizeCategory = (value) => (value || "").toLowerCase().replace(/[^a-z]/g, "");

export default function CategoryPage() {
  const { categoryName = "" } = useParams();
  const slug = normalizeCategory(categoryName);
  const [products, setProducts] = useState(categorySeeds);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const productList = Array.isArray(data) && data.length > 0 ? data : categorySeeds;
        setProducts(productList);
      })
      .catch(() => setProducts(categorySeeds));
  }, [categoryName]);

  const filteredProducts = useMemo(() => {
    const categoryMatches = {
      rice: ["rice"],
      fruits: ["fruit", "fruits"],
      fruit: ["fruit", "fruits"],
      pulses: ["pulses"],
      oils: ["oils"],
      dairy: ["dairy"],
      vegetables: ["vegetables", "vegetable"],
      vegetable: ["vegetables", "vegetable"],
    };

    const allowed = categoryMatches[slug] || [slug];

    return products.filter((product) => {
      const category = normalizeCategory(product.category);
      return allowed.includes(category);
    });
  }, [products, slug]);

  const displayName = categoryName
    ? categoryName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Products";

  return (
    <div className="storefront-shell">
      <Navbar />
      <main className="storefront-main">
        <section className="hero-section" style={{ minHeight: "140px", alignItems: "center" }}>
          <div>
            <span className="badge-pill" style={{ background: "rgba(255,255,255,0.16)", color: "white" }}>
              Category collection
            </span>
            <h2 className="hero-title">{displayName}</h2>
            <p className="hero-copy">Fresh picks selected for your favorite organic essentials.</p>
            <div className="hero-tags">
              <Link to="/" className="hero-tag" style={{ textDecoration: "none" }}>
                Back to shop
              </Link>
            </div>
          </div>
        </section>

        <div className="content-grid">
          <div className="products-panel">
            <div className="section-header">
              <div>
                <h3 className="section-title">{displayName} products</h3>
                <span className="section-subtitle">{filteredProducts.length} item{filteredProducts.length === 1 ? "" : "s"}</span>
              </div>
              <span className="badge-pill">Fresh picks</span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.name} product={product} />
                ))}
              </div>
            ) : (
              <div className="cart-empty" style={{ marginTop: "20px" }}>No products found in this category yet.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
