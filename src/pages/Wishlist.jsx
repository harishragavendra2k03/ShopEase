import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../context/useCart";
import { useWishlist } from "../context/useWishlist";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import "./Wishlist.css";

function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, isCartUpdating } = useCart();
  const navigate = useNavigate();

  function handleRemove(item) {
    removeFromWishlist(item.id);
    toast.success(`${item.title} removed from wishlist`);
  }

  function handleAddToCart(item) {
    addToCart(item);
    toast.success(`${item.title} added to cart`);
  }

  return (
    <main className="wishlist-page">
      <header className="wishlist-header">
        <div>
          <p className="wishlist-eyebrow">Saved for later</p>
          <h1>My Wishlist</h1>
        </div>
        <Link to="/">Continue shopping</Link>
      </header>

      {items.length === 0 ? (
        <EmptyState
          className="wishlist-empty"
          icon="♡"
          title="Your wishlist is empty"
          description="Save products you love and find them here."
          actionLabel="Continue shopping"
          onAction={() => navigate("/")}
        />
      ) : (
        <section className="wishlist-grid" aria-label="Wishlist products">
          {items.map((item) => (
            <article className="wishlist-card" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="wishlist-card-details">
                <p className="wishlist-category">{item.category}</p>
                <h2>{item.title}</h2>
                <strong>${item.price.toFixed(2)}</strong>
                <div className="wishlist-actions">
                  <button
                    className="wishlist-add-button"
                    type="button"
                    disabled={isCartUpdating}
                    onClick={() => handleAddToCart(item)}
                  >
                    {isCartUpdating ? (
                      <Loading label="Adding..." inline />
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                  <button
                    className="wishlist-remove-button"
                    type="button"
                    onClick={() => handleRemove(item)}
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Wishlist;
