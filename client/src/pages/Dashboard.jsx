import { useContext, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import AddProductModal from "../components/AddProductModal";
import Toast from "../components/Toast";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (!user?.token || user.role !== "admin") {
      setOrders([]);
      setOrdersError("Sign in as an admin to view store orders.");
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load store orders.");
        if (!Array.isArray(data)) throw new Error("Unexpected order data response.");
        setOrders(data);
        setOrdersError("");
      })
      .catch((error) => {
        setOrders([]);
        setOrdersError(error.message || "Could not load store orders.");
      })
      .finally(() => setOrdersLoading(false));
  }, [user?.token, user?.role]);

  useEffect(() => {
    if (!user?.token) {
      setCustomers([]);
      setCustomersError("Sign in as an admin to view customer details.");
      setCustomersLoading(false);
      return;
    }

    setCustomersLoading(true);
    fetch("/api/auth/users", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load customer details.");
        if (!Array.isArray(data)) throw new Error("Unexpected customer data response.");
        setCustomers(data.filter((customer) => (customer.role || "buyer") === "buyer"));
        setCustomersError("");
      })
      .catch((error) => {
        setCustomers([]);
        setCustomersError(error.message || "Could not load customer details.");
      })
      .finally(() => setCustomersLoading(false));
  }, [user?.token]);

  const handleAddProduct = async (product) => {
    if (!user?.token) throw new Error("Please sign in as an admin before adding products.");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(product),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Could not add the product.");

    setProducts((prev) => [data, ...prev]);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const summary = useMemo(() => {
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, product) => sum + Number(product.price || 0), 0);
    const bestSeller = products.reduce(
      (best, product) => Number(product.purchaseCount || 0) > Number(best?.purchaseCount || 0) ? product : best,
      null
    );
    const lowStockCount = products.filter((product) => Number(product.price || 0) < 300).length;
    const totalCustomers = customers.length;

    return {
      totalProducts,
      totalInventoryValue,
      bestSeller: bestSeller?.purchaseCount ? bestSeller.name : "No purchases yet",
      lowStockCount,
      totalCustomers,
    };
  }, [products, customers]);

  const inventoryRows = [...products]
    .sort((left, right) => Number(right.purchaseCount || 0) - Number(left.purchaseCount || 0))
    .map((product, index) => ({
      ...product,
      stock: Math.max(8, (index + 2) * 5),
      status: Number(product.purchaseCount || 0) > 0 ? "Popular" : "In stock",
    }));

  return (
    <div style={{ background: "linear-gradient(180deg, #f3f6f8 0%, #eef3f8 100%)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: "1220px", margin: "0 auto", padding: "28px 20px 40px" }}>
        <section style={{ background: "linear-gradient(135deg, #0e2a3a 0%, #183f4d 100%)", borderRadius: "26px", padding: "28px", boxShadow: "0 18px 38px rgba(15, 35, 49, 0.22)", display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: "20px", color: "white", marginBottom: "28px" }}>
          <div>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", color: "white", borderRadius: "999px", padding: "8px 12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.72rem" }}>
              Admin portal
            </span>
            <h2 style={{ margin: "14px 0 10px", fontSize: "2.3rem", lineHeight: 1.1 }}>
              Store control center for oversight and growth.
            </h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: "1rem", lineHeight: 1.7 }}>
              Monitor marketplace performance, manage product inventory, and keep the entire store running smoothly.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
              <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 10px", borderRadius: "999px", fontSize: "0.8rem" }}>Marketplace health</span>
              <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 10px", borderRadius: "999px", fontSize: "0.8rem" }}>Inventory insights</span>
              <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 10px", borderRadius: "999px", fontSize: "0.8rem" }}>Admin actions</span>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "20px", padding: "18px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "14px", fontSize: "1.1rem" }}>Admin profile</h3>
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.8 }}>Admin</div>
                <strong style={{ fontSize: "1.15rem" }}>{user?.name || "Admin"}</strong>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.8 }}>Access</div>
                <strong style={{ fontSize: "1.05rem" }}>Full marketplace control</strong>
              </div>
            </div>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
          <div>
            <div style={{ color: "#2e7d32", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.75rem" }}>
              Dashboard
            </div>
            <h2 style={{ margin: "8px 0 0", fontSize: "2rem", color: "#173626" }}>Store overview</h2>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => setModalOpen(true)} style={{ background: "linear-gradient(135deg, #0d2d3d, #1f6d42)", color: "white", border: "none", borderRadius: "12px", padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
              + Add Product
            </button>
            <button style={{ background: "#ffffff", color: "#173626", border: "1px solid #dfe9d6", borderRadius: "12px", padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
              Export Report
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Products", value: summary.totalProducts, hint: "Live items", accent: "#eaf8eb" },
            { label: "Customers", value: summary.totalCustomers, hint: "Registered users", accent: "#eef4ff" },
            { label: "Revenue", value: `₹${summary.totalInventoryValue.toLocaleString()}`, hint: "Inventory value", accent: "#fff7e8" },
            { label: "Best seller", value: summary.bestSeller, hint: "Most units purchased", accent: "#fff0f2" },
          ].map((card) => (
            <div key={card.label} style={{ background: card.accent, border: "1px solid #e7eadf", borderRadius: "18px", padding: "18px", boxShadow: "0 12px 28px rgba(0,0,0,0.04)" }}>
              <div style={{ color: "#6b776d", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{card.label}</div>
              <div style={{ marginTop: "10px", fontSize: "1.8rem", fontWeight: 800, color: "#183323" }}>{card.value}</div>
              <div style={{ marginTop: "8px", color: "#4d5e53", fontSize: "0.86rem" }}>{card.hint}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: "20px" }}>
          <section id="inventory-section" style={{ background: "white", border: "1px solid #ebefea", borderRadius: "20px", padding: "20px", boxShadow: "0 12px 28px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#173626", fontSize: "1.2rem" }}>Inventory</h3>
                <div style={{ color: "#6b776d", fontSize: "0.88rem", marginTop: "4px" }}>Product performance and stock</div>
              </div>
              <span style={{ background: "#edf8eb", color: "#2e7d32", borderRadius: "999px", padding: "6px 10px", fontWeight: 700, fontSize: "0.75rem" }}>Updated today</span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "650px" }}>
                <thead>
                  <tr style={{ background: "#f7f9f4", color: "#516159" }}>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Product</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Category</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Price</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Units purchased</th>
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
                      <td style={{ padding: "12px 10px", color: "#213c2d" }}>{product.purchaseCount || 0}</td>
                      <td style={{ padding: "12px 10px", color: "#213c2d" }}>{product.stock}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <span style={{ display: "inline-block", padding: "6px 10px", borderRadius: "999px", background: product.status === "Popular" ? "#eaf8eb" : "#eef5ff", color: product.status === "Popular" ? "#2e7d32" : "#3154b1", fontSize: "0.75rem", fontWeight: 800 }}>{product.status}</span>
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
                <button onClick={() => scrollToSection("inventory-section")} style={{ background: "#edf8eb", color: "#246b35", border: "none", borderRadius: "12px", padding: "12px 14px", fontWeight: 700, cursor: "pointer" }}>Manage Products</button>
                <button onClick={() => scrollToSection("orders-section")} style={{ background: "#f7f3e8", color: "#6b4f11", border: "none", borderRadius: "12px", padding: "12px 14px", fontWeight: 700, cursor: "pointer" }}>View Orders</button>
                <button onClick={() => scrollToSection("customers-section")} style={{ background: "#eef4ff", color: "#2549a2", border: "none", borderRadius: "12px", padding: "12px 14px", fontWeight: 700, cursor: "pointer" }}>View Customers</button>
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, #1f6d42 0%, #3eaa58 100%)", borderRadius: "20px", padding: "20px", color: "white", boxShadow: "0 18px 30px rgba(31, 109, 66, 0.18)" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.9 }}>Performance</div>
              <div style={{ marginTop: "10px", fontSize: "2rem", fontWeight: 800 }}>+18.4%</div>
              <div style={{ marginTop: "8px", opacity: "0.9" }}>Monthly sales growth</div>
            </div>
          </aside>
        </div>

        <section id="orders-section" style={{ background: "white", border: "1px solid #ebefea", borderRadius: "20px", padding: "20px", boxShadow: "0 12px 28px rgba(0,0,0,0.04)", marginTop: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#173626", fontSize: "1.2rem" }}>Store orders</h3>
              <div style={{ color: "#6b776d", fontSize: "0.88rem", marginTop: "4px" }}>Recent customer purchases and delivery status</div>
            </div>
            <span style={{ background: "#f7f3e8", color: "#6b4f11", borderRadius: "999px", padding: "6px 10px", fontWeight: 700, fontSize: "0.75rem" }}>{ordersLoading ? "Loading orders..." : `${orders.length} orders`}</span>
          </div>
          {ordersError && <p role="alert" style={{ color: "#b91c1c" }}>{ordersError}</p>}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
              <thead>
                <tr style={{ background: "#f7f9f4", color: "#516159" }}>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Customer</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Items</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Delivery</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Total</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: "18px 10px", color: "#6b776d", textAlign: "center" }}>No orders yet.</td></tr>
                )}
                {!ordersError && orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #eef1ea" }}>
                    <td style={{ padding: "12px 10px", color: "#213c2d" }}>
                      <strong>{order.account?.name || "Customer"}</strong>
                      <div>{order.account?.email || order.userEmail}</div>
                      <div>{order.account?.phone || "No phone provided"}</div>
                    </td>
                    <td style={{ padding: "12px 10px", color: "#213c2d" }}>
                      {(order.items || []).map((item) => `${item.name} × ${item.quantity}`).join(", ")}
                    </td>
                    <td style={{ padding: "12px 10px", color: "#213c2d" }}>
                      {order.delivery?.name}, {order.delivery?.address}, {order.delivery?.pincode}
                    </td>
                    <td style={{ padding: "12px 10px", color: "#213c2d", fontWeight: 700 }}>₹{Number(order.total || 0).toLocaleString()}</td>
                    <td style={{ padding: "12px 10px", color: "#213c2d" }}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="customers-section" style={{ background: "white", border: "1px solid #ebefea", borderRadius: "20px", padding: "20px", boxShadow: "0 12px 28px rgba(0,0,0,0.04)", marginTop: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#173626", fontSize: "1.2rem" }}>Customer database</h3>
              <div style={{ color: "#6b776d", fontSize: "0.88rem", marginTop: "4px" }}>Registered customers and their latest saved delivery address</div>
            </div>
            <span style={{ background: "#edf8eb", color: "#2e7d32", borderRadius: "999px", padding: "6px 10px", fontWeight: 700, fontSize: "0.75rem" }}>{customersLoading ? "Loading customers..." : `${customers.length} customers`}</span>
          </div>

          {customersError && <p role="alert" style={{ color: "#b91c1c" }}>{customersError}</p>}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "850px" }}>
              <thead>
                <tr style={{ background: "#f7f9f4", color: "#516159" }}>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Name</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Email</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Phone</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Latest delivery address</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "0.8rem", fontWeight: 700 }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {customersLoading ? null : customers.length === 0 && !customersError ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "18px 10px", color: "#6b776d", textAlign: "center" }}>No customer records found.</td>
                  </tr>
                ) : !customersError && (
                  customers.map((customer) => (
                    <tr key={customer.id || customer.email} style={{ borderBottom: "1px solid #eef1ea" }}>
                      <td style={{ padding: "12px 10px", fontWeight: 700, color: "#213c2d" }}>{customer.name || "Unknown"}</td>
                      <td style={{ padding: "12px 10px", color: "#5a695f" }}>{customer.email}</td>
                      <td style={{ padding: "12px 10px", color: "#213c2d" }}>{customer.phone || "Not provided"}</td>
                      <td style={{ padding: "12px 10px", color: "#213c2d" }}>{customer.latestDelivery?.address ? `${customer.latestDelivery.address}${customer.latestDelivery.pincode ? `, ${customer.latestDelivery.pincode}` : ""}` : "No delivery address yet"}</td>
                      <td style={{ padding: "12px 10px" }}>
                        <span style={{ display: "inline-block", padding: "6px 10px", borderRadius: "999px", background: customer.role === "admin" ? "#eef4ff" : "#eaf8eb", color: customer.role === "admin" ? "#3154b1" : "#2e7d32", fontSize: "0.75rem", fontWeight: 800, textTransform: "capitalize" }}>
                          {customer.role || "buyer"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddProduct} />
      <Toast message="Product added" visible={toast} />
    </div>
  );
}
