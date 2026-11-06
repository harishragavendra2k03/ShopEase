
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { useWishlist } from "../context/useWishlist";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ onOpenCart }) {
  const { search, setSearch } = useSearch();
  const { itemCount, clearCart } = useCart();
  const { items: wishlistItems, clearWishlist } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const wishlistCount = wishlistItems.length;

  function handleLogout() {
    clearCart();
    clearWishlist();
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <h2 className="logo">ShopEase 🛍️</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <button className="cart" type="button" onClick={onOpenCart}>
        🛒 Cart <span>{itemCount}</span>
      </button>
      {user ? (
        <div className="auth-nav-links">
          <Link to="/wishlist">Wishlist ({wishlistCount})</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/orders">My Orders</Link>
          <button className="auth-nav-button" type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      ) : (
        <div className="auth-nav-links">
          <Link to="/wishlist">Wishlist ({wishlistCount})</Link>
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
