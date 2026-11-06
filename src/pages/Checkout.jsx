import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { saveOrder } from "../utils/orders";
import Loading from "../components/Loading";
import "./Checkout.css";

const initialCustomer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

function Checkout() {
  const { items, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const [customer, setCustomer] = useState(initialCustomer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLock = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Add products to your cart before checking out.</p>
          <button type="button" onClick={() => navigate("/")}>
            Browse products
          </button>
        </section>
      </main>
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submissionLock.current) return;

    const hasMissingField = Object.values(customer).some(
      (value) => !value.trim(),
    );
    if (hasMissingField) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const order = {
      customer,
      items: [...items],
      itemCount,
      total,
      ownerEmail: user.email,
      createdAt: new Date().toISOString(),
      status: "Pending",
      orderId: `SE-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
    };

    try {
      saveOrder(order);
    } catch {
      toast.error("Unable to save your order. Please try again.");
      submissionLock.current = false;
      setIsSubmitting(false);
      return;
    }

    clearCart();
    navigate("/order-confirmation", { state: { order } });
  }

  function renderField(name, label, type = "text", autoComplete) {
    return (
      <label className="checkout-field" htmlFor={name}>
        <span>{label}</span>
        <input
          id={name}
          name={name}
          type={type}
          value={customer[name]}
          onChange={handleChange}
          autoComplete={autoComplete}
          required
        />
      </label>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <p>ShopEase checkout</p>
        <h1>Delivery details</h1>
      </header>

      <div className="checkout-layout">
        <form className="checkout-form" noValidate onSubmit={handleSubmit}>
          <section className="checkout-section">
            <h2>Customer information</h2>
            <div className="checkout-fields">
              {renderField("name", "Full name", "text", "name")}
              {renderField("email", "Email address", "email", "email")}
              {renderField("phone", "Phone number", "tel", "tel")}
            </div>
          </section>

          <section className="checkout-section">
            <h2>Delivery address</h2>
            <div className="checkout-fields">
              {renderField("address", "Street address", "text", "street-address")}
              {renderField("city", "City", "text", "address-level2")}
              {renderField("state", "State / Province", "text", "address-level1")}
              {renderField("postalCode", "Postal code", "text", "postal-code")}
              {renderField("country", "Country", "text", "country-name")}
            </div>
          </section>

          <button
            className="checkout-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loading label="Placing order..." inline />
            ) : (
              "Place order"
            )}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.title} <small>× {item.quantity}</small>
                </span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          <div className="checkout-summary-row">
            <span>Subtotal ({itemCount} items)</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <div className="checkout-summary-total">
            <span>Order total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
      <button
        className="checkout-back"
        type="button"
        onClick={() => navigate(location.state?.from || "/cart")}
      >
        Back to cart
      </button>
    </main>
  );
}

export default Checkout;
