import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { loadOrdersForUser } from "../utils/orders";
import EmptyState from "../components/EmptyState";
import "./MyOrders.css";

function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderResult] = useState(() => {
    try {
      return { orders: loadOrdersForUser(user?.email ?? ""), error: "" };
    } catch {
      return {
        orders: [],
        error: "Unable to load your orders. Please try again.",
      };
    }
  });
  const { orders, error: loadError } = orderResult;

  useEffect(() => {
    if (loadError) toast.error(loadError);
  }, [loadError]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: { pathname: "/orders" } }} />;
  }

  return (
    <main className="my-orders-page">
      <header className="my-orders-header">
        <p>ShopEase account</p>
        <h1>My Orders</h1>
      </header>

      {loadError ? (
        <EmptyState
          className="my-orders-empty"
          icon="⚠️"
          title="Orders could not be loaded"
          description={loadError}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          className="my-orders-empty"
          icon="📦"
          title="No orders yet"
          description="Your placed orders will appear here. Find something you love and it will be waiting for you here."
          actionLabel="Continue shopping"
          onAction={() => navigate("/")}
        />
      ) : (
        <section className="my-orders-list" aria-label="Your orders">
          {orders.map((order) => {
            const expanded = expandedOrderId === order.orderId;
            const orderDate = order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "Date unavailable";

            return (
              <article className="my-order-card" key={order.orderId}>
                <div className="my-order-overview">
                  <div>
                    <p className="my-order-label">Order ID</p>
                    <strong>{order.orderId}</strong>
                  </div>
                  <div>
                    <p className="my-order-label">Date</p>
                    <span>{orderDate}</span>
                  </div>
                  <div>
                    <p className="my-order-label">Status</p>
                    <span className="my-order-status">
                      {order.status || "Pending"}
                    </span>
                  </div>
                  <div>
                    <p className="my-order-label">Total</p>
                    <strong>${Number(order.total).toFixed(2)}</strong>
                  </div>
                  <button
                    className="my-order-details-button"
                    type="button"
                    aria-expanded={expanded}
                    onClick={() =>
                      setExpandedOrderId(expanded ? null : order.orderId)
                    }
                  >
                    {expanded ? "Hide Details" : "View Details"}
                  </button>
                </div>
                {expanded && (
                  <div className="my-order-details">
                    <h2>Products</h2>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          <span>{item.title} × {item.quantity}</span>
                          <strong>
                            ${(item.price * item.quantity).toFixed(2)}
                          </strong>
                        </li>
                      ))}
                    </ul>
                    {order.customer && (
                      <div className="my-order-delivery">
                        <h2>Delivery address</h2>
                        <p>{order.customer.name}</p>
                        <p>{order.customer.address}</p>
                        <p>
                          {order.customer.city}, {order.customer.state}{" "}
                          {order.customer.postalCode}
                        </p>
                        <p>{order.customer.country}</p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default MyOrders;
