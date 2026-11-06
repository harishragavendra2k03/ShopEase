import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../context/useCart";
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
  const { items, itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [customer, setCustomer] = useState(
    () => location.state?.customer ?? initialCustomer,
  );

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

  function handleSubmit(event) {
    event.preventDefault();

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

    navigate("/payment", { state: { customer } });
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
          >
            Proceed to Payment
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
