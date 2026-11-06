import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { queryRetryDelay, shouldRetryQuery } from "../services/apiErrors";

async function fetchProducts() {
  const response = await api.get("/products");
  if (
    !Array.isArray(response.data) ||
    response.data.some(
      (product) =>
        !product ||
        (typeof product.id !== "number" && typeof product.id !== "string") ||
        typeof product.title !== "string" ||
        typeof product.image !== "string" ||
        !Number.isFinite(product.price),
    )
  ) {
    throw new Error("The product service returned invalid product data.");
  }
  return response.data;
}

async function fetchCategories() {
  const response = await api.get("/products/categories");
  if (
    !Array.isArray(response.data) ||
    response.data.some((category) => typeof category !== "string")
  ) {
    throw new Error("The product service returned invalid category data.");
  }
  return response.data;
}

function useProduct() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    retry: shouldRetryQuery,
    retryDelay: queryRetryDelay,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    retry: shouldRetryQuery,
    retryDelay: queryRetryDelay,
  });
}

export default useProduct;