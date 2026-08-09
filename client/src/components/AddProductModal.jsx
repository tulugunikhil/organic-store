export default function AddProductModal({ open, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-96 rounded bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Add Product</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            onSubmit({
              name: form.name.value,
              price: Number(form.price.value),
              description: form.description.value,
              category: form.category.value
            });
            form.reset();
            onClose();
          }}
          className="space-y-3"
        >
          <input name="name" placeholder="Product name" className="w-full border p-2" required />
          <input name="price" type="number" placeholder="Price" className="w-full border p-2" required />
          <input name="description" placeholder="Description" className="w-full border p-2" />
          <input name="category" placeholder="Category" className="w-full border p-2" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded bg-gray-300 px-3 py-2">
              Cancel
            </button>
            <button type="submit" className="rounded bg-green-600 px-3 py-2 text-white">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
