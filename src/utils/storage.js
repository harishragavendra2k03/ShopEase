const CART_STORAGE_KEY = "shopease-cart";

function isValidCartItem(item) {
  return (
    item &&
    (typeof item.id === "number" || typeof item.id === "string") &&
    typeof item.title === "string" &&
    typeof item.image === "string" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function removeInvalidCart() {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Unable to clear invalid cart data from localStorage.", error);
  }
}

export function loadCart() {
  let savedCart;
  try {
    savedCart = localStorage.getItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Unable to read the cart from localStorage.", error);
    return {
      items: [],
      hadInvalidData: false,
      error: "Unable to access your saved cart in this browser.",
    };
  }

  if (!savedCart) {
    return { items: [], hadInvalidData: false, error: "" };
  }

  try {
    const items = JSON.parse(savedCart);
    if (!Array.isArray(items)) {
      removeInvalidCart();
      return {
        items: [],
        hadInvalidData: true,
        error: "Invalid saved cart data was cleared.",
      };
    }

    const validItems = items.filter(isValidCartItem);
    if (validItems.length !== items.length) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validItems));
    }
    return {
      items: validItems,
      hadInvalidData: validItems.length !== items.length,
      error: validItems.length !== items.length
        ? "Invalid saved cart items were removed."
        : "",
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      removeInvalidCart();
      return {
        items: [],
        hadInvalidData: true,
        error: "Invalid saved cart data was cleared.",
      };
    }
    console.error("Unable to repair invalid cart data in localStorage.", error);
    return {
      items: [],
      hadInvalidData: true,
      error: "Unable to repair invalid saved cart data.",
    };
  }
}

export function saveCart(items) {
  try {
    if (items.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Unable to save the cart to localStorage.", error);
    throw error;
  }
}