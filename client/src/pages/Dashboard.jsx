import { useEffect, useState } from "react";
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
      .then((data) => setProducts(data));
  }, []);

  const handleAddProduct = async (product) => {
    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });

    if (res.ok) {
      const newProduct = await res.json();
      setProducts((prev) => [...prev, newProduct]);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <button onClick={() => setModalOpen(true)} className="mb-4 rounded bg-green-600 px-4 py-2 text-white">
          Add Product
        </button>
        <ul>
          {products.map((product) => (
            <li key={product._id} className="mb-2 rounded border p-2">
              {product.name} — ${product.price}
            </li>
          ))}
        </ul>
      </div>
      <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddProduct} />
      <Toast message="Product added" visible={toast} />
    </div>
  );
}
