const LAST_ORDER_STORAGE_KEY = "shopease-last-order";
const ORDERS_STORAGE_KEY = "shopease-orders";

export function saveOrder(order) {
  localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order));

  const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  let orders = [];

  if (savedOrders) {
    try {
      const parsedOrders = JSON.parse(savedOrders);
      orders = Array.isArray(parsedOrders) ? parsedOrders : [];
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }
  }

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...orders]));
}

export function loadOrdersForUser(email) {
  const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!savedOrders) return [];

  try {
    const orders = JSON.parse(savedOrders);
    if (!Array.isArray(orders)) return [];

    return orders.filter(
      (order) => order.ownerEmail === email.trim().toLowerCase(),
    );
  } catch (error) {
    if (error instanceof SyntaxError) return [];
    throw error;
  }
}

export function loadLastOrder() {
  const savedOrder = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
  if (!savedOrder) return null;

  try {
    return JSON.parse(savedOrder);
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}
