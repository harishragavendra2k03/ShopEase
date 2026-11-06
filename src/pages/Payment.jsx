import { useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import { saveOrder } from "../utils/orders";
import Loading from "../components/Loading";
import "./Payment.css";

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery (COD)", description: "Pay when your order arrives." },
  { id: "upi", label: "UPI", description: "Simulated UPI payment; no UPI details needed." },
  { id: "credit-card", label: "Credit Card", description: "Simulated card payment; no card details needed." },
  { id: "debit-card", label: "Debit Card", description: "Simulated card payment; no card details needed." },
];

function createOrderId() {
  const uniqueId = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `SE-${uniqueId}`;
}

function Payment() {
  const { items, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLock = useRef(false);
  const customer = state?.customer;

  if (!customer) return <Navigate to="/checkout" replace />;
  if (items.length === 0) return <Navigate to="/cart" replace />;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function handleSubmit(event) {
    event.preventDefault();
    if (submissionLock.current) return;

    submissionLock.current = true;
    setIsSubmitting(true);

    const order = {
      customer,
      items: [...items],
      itemCount,
      total,
      ownerEmail: user.email,
      createdAt: new Date().toISOString(),
      status: "Pending",
      orderId: createOrderId(),
      paymentMethod: paymentMethods.find((method) => method.id === paymentMethod).label,
      paymentSimulation: true,
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

  return (
    <main className="checkout-page payment-page">
      <header className="checkout-header">
        <p>ShopEase checkout</p>
        <h1>Payment</h1>
      </header>

      <div className="checkout-layout">
        <form className="checkout-form payment-form" onSubmit={handleSubmit}>
          <section className="checkout-section">
            <h2>Choose a payment method</h2>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <label
                  className={`payment-method${paymentMethod === method.id ? " is-selected" : ""}`}
                  key={method.id}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                  <span className="payment-method-copy">
                    <strong>{method.label}</strong>
                    <small>{method.description}</small>
                  </span>
                </label>
              ))}
            </div>
            <p className="payment-disclaimer">
              This is a payment simulation only. No real transaction will occur, and
              ShopEase does not collect or store card numbers, CVVs, or UPI details.
            </p>
          </section>

          <button
            className="checkout-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loading label="Placing order..." inline />
            ) : (
              `Place Order · $${total.toFixed(2)}`
            )}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          <ul className="checkout-items payment-items">
            {items.map((item) => (
              <li key={item.id}>
                <span className="payment-item-name">
                  {item.title}
                  <small>Qty {item.quantity} · ${item.price.toFixed(2)} each</small>
                </span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          <div className="checkout-summary-row">
            <span>Items ({itemCount})</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <div className="checkout-summary-total">
            <span>Total amount</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <div className="payment-delivery">
            <strong>Delivering to</strong>
            <span>{customer.name}</span>
            <span>{customer.address}, {customer.city}</span>
          </div>
        </aside>
      </div>
      <button
        className="checkout-back"
        type="button"
        onClick={() => navigate("/checkout", { state: { customer } })}
      >
        Back to delivery details
      </button>
    </main>
  );
}

export default Payment;
