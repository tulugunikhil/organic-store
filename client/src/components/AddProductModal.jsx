import { useState } from "react";

export default function AddProductModal({ open, onClose, onSubmit }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      await onSubmit({
        name: formData.get("name"),
        price: Number(formData.get("price")),
        description: formData.get("description"),
        category: formData.get("category"),
      });
      form.reset();
      onClose();
    } catch (submitError) {
      setError(submitError.message || "Could not add the product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-96 rounded bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Add Product</h2>
        {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Product name" className="w-full border p-2" required />
          <input name="price" type="number" min="0.01" step="0.01" placeholder="Price" className="w-full border p-2" required />
          <input name="description" placeholder="Description" className="w-full border p-2" />
          <input name="category" placeholder="Category" className="w-full border p-2" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={submitting} className="rounded bg-gray-300 px-3 py-2">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="rounded bg-green-600 px-3 py-2 text-white disabled:opacity-60">
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
