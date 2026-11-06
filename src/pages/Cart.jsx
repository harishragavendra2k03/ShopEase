import { useCart } from "../context/useCart";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import "./Cart.css";

function Cart({ onContinueShopping, onCheckout }) {
  const {
    items,
    itemCount,
    updateQuantity,
    removeFromCart,
    isCartUpdating,
  } = useCart();
  function handleRemove(item) {
    removeFromCart(item.id);
    toast.success(`${item.title} removed from cart`);
  }

  const total = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <main className="cart-page">
      <header className="cart-page-header">
        <div>
          <p className="cart-eyebrow">Your ShopEase order</p>
          <h1>Shopping Cart</h1>
        </div>
        <button
          className="continue-shopping-button"
          type="button"
          onClick={onContinueShopping}
        >
          Continue shopping
        </button>
      </header>

      {items.length === 0 ? (
        <EmptyState
          className="empty-cart"
          icon="🛒"
          title="Your cart is empty"
          description="Browse our products and add something you love."
          actionLabel="Continue shopping"
          onAction={onContinueShopping}
        />
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Items in your cart">
            {isCartUpdating && <Loading label="Updating cart..." inline />}
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img
                  className="cart-item-image"
                  src={item.image}
                  alt={item.title}
                />
                <div className="cart-item-details">
                  <p className="cart-item-category">{item.category}</p>
                  <h2>{item.title}</h2>
                  <p className="cart-item-unit-price">
                    ${item.price.toFixed(2)} each
                  </p>
                  <button
                    className="cart-remove-button"
                    type="button"
                    disabled={isCartUpdating}
                    onClick={() => handleRemove(item)}
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </div>
                <div className="cart-item-actions">
                  <div
                    className="quantity-control"
                    aria-label={`Quantity for ${item.title}`}
                  >
                    <button
                      type="button"
                      disabled={isCartUpdating || item.quantity <= 1}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      aria-label={`Decrease quantity of ${item.title}`}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      disabled={isCartUpdating}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      aria-label={`Increase quantity of ${item.title}`}
                    >
                      +
                    </button>
                  </div>
                  <strong className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div className="cart-summary-row">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span className="cart-free-shipping">Calculated at checkout</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button
              className="cart-primary-button"
              type="button"
              disabled={isCartUpdating}
              onClick={onCheckout}
            >
              {isCartUpdating ? (
                <Loading label="Updating cart..." inline />
              ) : (
                "Proceed to checkout"
              )}
            </button>
            <p className="cart-summary-note">
              Shipping and taxes are calculated at checkout.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;