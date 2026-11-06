import { useEffect, useState, useTransition } from "react";
import { CartContext } from "./CartContextStore";
import { loadCart, saveCart } from "../utils/storage";
import { toast } from "react-hot-toast";

export function CartProvider({ children }) {
  const [savedCart] = useState(loadCart);
  const [items, setItems] = useState(savedCart.items);
  const [isCartUpdating, startCartUpdate] = useTransition();

  useEffect(() => {
    if (savedCart.error) {
      toast.error(savedCart.error);
    }
  }, [savedCart.error]);

  useEffect(() => {
    try {
      saveCart(items);
    } catch {
      toast.error("Unable to save your cart in this browser.");
    }
  }, [items]);

  function addToCart(product) {
    startCartUpdate(() => {
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          return currentItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }

        return [...currentItems, { ...product, quantity: 1 }];
      });
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;

    startCartUpdate(() => {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    });
  }

  function removeFromCart(productId) {
    startCartUpdate(() => {
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== productId),
      );
    });
  }

  function clearCart() {
    try {
      saveCart([]);
    } catch {
      toast.error("Unable to clear the saved cart in this browser.");
    }
    startCartUpdate(() => setItems([]));
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartUpdating,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}