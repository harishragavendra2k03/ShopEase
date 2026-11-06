import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link className="footer-brand" to="/">
          ShopEase <span aria-hidden="true">🛍️</span>
        </Link>
        <p>Find something you love, every day.</p>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/">Shop</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
        </nav>
        <small>© {new Date().getFullYear()} ShopEase</small>
      </div>
    </footer>
  );
}

export default Footer;
