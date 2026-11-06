import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loadLastOrder } from "../utils/orders";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order ?? loadLastOrder();

  useEffect(() => {
    if (state?.order) toast.success("Your order has been placed successfully!");
  }, [state?.order]);

  if (
    !order?.orderId ||
    !order.customer ||
    !Array.isArray(order.items) ||
    !Number.isFinite(order.total)
  ) {
    return <Navigate to="/" replace />;
  }

  const { customer } = order;

  return (
    <main className="order-confirmation-page">
      <section className="order-confirmation-card">
        <div className="order-success-icon" aria-hidden="true">✓</div>
        <p className="order-confirmation-eyebrow">ShopEase order complete</p>
        <h1>Thank you for your order!</h1>
        <p className="order-confirmation-message">
          Your order has been placed successfully.
        </p>
        <p className="order-confirmation-id">
          Order ID: <strong>{order.orderId}</strong>
        </p>

        <div className="order-confirmation-details">
          <section>
            <h2>Customer details</h2>
            <p>{customer.name}</p>
            <p>{customer.email}</p>
            <p>{customer.phone}</p>
          </section>
          <section>
            <h2>Delivery address</h2>
            <p>{customer.address}</p>
            <p>
              {customer.city}, {customer.state} {customer.postalCode}
            </p>
            <p>{customer.country}</p>
          </section>
        </div>

        <section className="order-confirmation-products">
          <h2>Ordered products</h2>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                <span>{item.title} <small>× {item.quantity}</small></span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          <div className="order-confirmation-total">
            <span>Order total</span>
            <strong>${order.total.toFixed(2)}</strong>
          </div>
        </section>

        <button
          className="continue-shopping-button"
          type="button"
          onClick={() => navigate("/")}
        >
          Continue shopping
        </button>
      </section>
    </main>
  );
}

export default OrderConfirmation;
