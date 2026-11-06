import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Navbar from "./components/Navbar.jsx";
import Checkout from "./pages/Checkout.jsx";
import Payment from "./pages/Payment.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Footer from "./components/Footer.jsx";
import { useAuth } from "./context/useAuth";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

function App() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      <Navbar onOpenCart={() => navigate("/cart")} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Product />} />
          <Route
            path="/cart"
            element={
              <Cart
                onContinueShopping={() => navigate("/")}
                onCheckout={() => navigate("/checkout")}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/payment"
            element={
              <RequireAuth>
                <Payment />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <MyOrders />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;