export default function Toast({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 rounded bg-green-600 px-4 py-2 text-white shadow">
      {message}
    </div>
  );
}
