import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { WishlistContext } from "./WishlistContextStore";

const WISHLIST_STORAGE_KEY = "shopease-wishlist";

function loadWishlist() {
  const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (!savedWishlist) return [];

  try {
    const wishlist = JSON.parse(savedWishlist);
    return Array.isArray(wishlist) ? wishlist : [];
  } catch (error) {
    if (error instanceof SyntaxError) return [];
    throw error;
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadWishlist);

  useEffect(() => {
    try {
      if (items.length === 0) {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
        return;
      }

      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Unable to persist the wishlist in localStorage.", error);
      toast.error("Unable to save your wishlist in this browser.");
    }
  }, [items]);

  function addToWishlist(product) {
    setItems((currentItems) =>
      currentItems.some((item) => item.id === product.id)
        ? currentItems
        : [...currentItems, product],
    );
  }

  function removeFromWishlist(productId) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  }

  function clearWishlist() {
    setItems([]);
  }

  function isInWishlist(productId) {
    return items.some((item) => item.id === productId);
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
