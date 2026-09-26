import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Storefront from "./pages/Storefront";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import AuthPage from "./pages/AuthPage";
import UserPage from "./pages/UserPage";
import SellerPage from "./pages/SellerPage";
import DebugPage from "./pages/DebugPage";
import CategoryPage from "./pages/CategoryPage";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Storefront />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/seller" element={<SellerPage />} />
            <Route path="/debug" element={<DebugPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
