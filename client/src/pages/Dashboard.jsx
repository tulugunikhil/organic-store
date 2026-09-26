import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import AddProductModal from "../components/AddProductModal";
import Toast from "../components/Toast";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => setProducts([]));
  }, []);

  const handleAddProduct = async (product) => {
    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      const newProduct = await res.json();
      setProducts((prev) => [...prev, newProduct]);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }
  };

  const summary = useMemo(() => {
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, product) => sum + Number(product.price || 0), 0);
    const bestSeller = products[0]?.name || "No items";
    const lowStockCount = products.filter((product) => Number(product.price || 0) < 300).length;

    return {
      totalProducts,
      totalInventoryValue,
      bestSeller,
      lowStockCount,
    };
  }, [products]);

  const inventoryRows = products.slice(0, 8).map((product, index) => ({
    ...product,
    stock: Math.max(8, (index + 2) * 5),
    status: Number(product.price || 0) > 500 ? "Popular" : "In stock",
  }));

  return (
    <div style={{ background: "#f5f7f1", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
          <div>
            <div style={{ color: "#2e7d32", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.75rem" }}>
              Dashboard
            </div>
            <h2 style={{ margin: "8px 0 0", fontSize: "2rem", color: "#173626" }}>Store overview</h2>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                background: "linear-gradient(135deg, #2d8f4e, #6fbf3c)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "10px 16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Add Product
            </button>
            <button
              style={{
                background: "#ffffff",
                color: "#173626",
                border: "1px solid #dfe9d6",
                borderRadius: "12px",
                padding: "10px 16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Export Report
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Products", value: summary.totalProducts, hint: "Live items", accent: "#eaf8eb" },
            { label: "Revenue", value: `₹${summary.totalInventoryValue.toLocaleString()}`, hint: "Inventory value", accent: "#eef4ff" },
            { label: "Best seller", value: summary.bestSeller, hint: "Top category", accent: "#fff7e8" },
            { label: "Low stock", value: summary.lowStockCount, hint: "Needs restock", accent: "#fff0f2" },
          ].map((card) => (
            <div
              key={card.label}
              style={{
                background: card.accent,
                border: "1px solid #e7eadf",
                borderRadius: "18px",
                padding: "18px",
                boxShadow: "0 12px 28px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ color: "#6b776d", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {card.label}
              </div>
              <div style={{ marginTop: "10px", fontSize: "1.8rem", fontWeight: 800, color: "#183323" }}>{card.value}</div>
              <div style={{ marginTop: "8px", color: "#4d5e53", fontSize: "0.86rem" }}>{card.hint}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: "20px" }}>
          <section style={{ background: "white", border: "1px solid #ebefea", borderRadius: "20px", padding: "20px", boxShadow: "0 12px 28px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#173626", fontSize: "1.2rem" }}>Inventory</h3>
                <div style={{ color: "#6b776d", fontSize: "0.88rem", marginTop: "4px" }}>Product performance and stock</div>
              </div>
              <span style={{ background: "#edf8eb", color: "#2e7d32", borderRadius: "999px", padding: "6px 10px", fontWeight: 700, fontSize: "0.75rem" }}>
                Updated today
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "540px" }}>
                <thead>
                  <tr style={{ background: "#f7f9f4", color: "#516159" }}>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Product</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Category</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Price</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Stock</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryRows.map((product) => (
                    <tr key={product._id || product.name} style={{ borderBottom: "1px solid #eef1ea" }}>
                      <td style={{ padding: "12px 10px", fontWeight: 700, color: "#213c2d" }}>{product.name}</td>
                      <td style={{ padding: "12px 10px", color: "#5a695f" }}>{product.category}</td>
                      <td style={{ padding: "12px 10px", color: "#213c2d", fontWeight: 700 }}>₹{product.price}</td>
                      <td style={{ padding: "12px 10px", color: "#213c2d" }}>{product.stock}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background: product.status === "Popular" ? "#eaf8eb" : "#eef5ff",
                            color: product.status === "Popular" ? "#2e7d32" : "#3154b1",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                          }}
                        >
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "white", border: "1px solid #ebefea", borderRadius: "20px", padding: "20px", boxShadow: "0 12px 28px rgba(0,0,0,0.04)" }}>
              <h3 style={{ margin: "0 0 14px", color: "#173626", fontSize: "1.1rem" }}>Quick actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button style={{ background: "#edf8eb", color: "#246b35", border: "none", borderRadius: "12px", padding: "12px 14px", fontWeight: 700, cursor: "pointer" }}>
                  Manage Products
                </button>
                <button style={{ background: "#f7f3e8", color: "#6b4f11", border: "none", borderRadius: "12px", padding: "12px 14px", fontWeight: 700, cursor: "pointer" }}>
                  View Orders
                </button>
                <button style={{ background: "#eef4ff", color: "#2549a2", border: "none", borderRadius: "12px", padding: "12px 14px", fontWeight: 700, cursor: "pointer" }}>
                  Promotions
                </button>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #1f6d42 0%, #3eaa58 100%)", borderRadius: "20px", padding: "20px", color: "white", boxShadow: "0 18px 30px rgba(31, 109, 66, 0.18)" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.9 }}>Performance</div>
              <div style={{ marginTop: "10px", fontSize: "2rem", fontWeight: 800 }}>+18.4%</div>
              <div style={{ marginTop: "8px", opacity: "0.9" }}>Monthly sales growth</div>
            </div>
          </aside>
        </div>
      </div>

      <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddProduct} />
      <Toast message="Product added" visible={toast} />
    </div>
  );
}
