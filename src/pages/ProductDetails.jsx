import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { getApiErrorMessage, queryRetryDelay, shouldRetryQuery } from "../services/apiErrors";
import { useCart } from "../context/useCart";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";
import "./ProductDetails.css";

async function fetchProduct(productId) {
  const response = await api.get(`/products/${productId}`);
  if (
    !response.data ||
    !response.data.id ||
    typeof response.data.title !== "string" ||
    !Number.isFinite(response.data.price)
  ) {
    throw new Error("The requested product could not be found.");
  }
  return response.data;
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isCartUpdating } = useCart();
  const isValidId = /^\d+$/.test(id ?? "") && Number(id) > 0;
  const {
    data: product,
    error,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: isValidId,
    retry: shouldRetryQuery,
    retryDelay: queryRetryDelay,
  });

  useEffect(() => {
    if (isError) toast.error(getApiErrorMessage(error));
  }, [error, isError]);

  if (!isValidId) {
    return (
      <section className="product-details-message" role="alert">
        <p>Product not found. The product ID is invalid.</p>
        <button type="button" onClick={() => navigate("/")}>
          Back to Products
        </button>
      </section>
    );
  }

  if (isLoading) {
    return <Loading label="Loading product..." />;
  }

  if (isError || !product?.id) {
    return (
      <section className="product-details-message" role="alert">
        <p>{getApiErrorMessage(error)}</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Retrying..." : "Try again"}
        </button>
        <button type="button" onClick={() => navigate("/")}>
          Back to Products
        </button>
      </section>
    );
  }

  return (
    <main className="product-details-page">
      <button
        className="product-details-back"
        type="button"
        onClick={() => navigate("/")}
      >
        ← Back to Products
      </button>

      <section className="product-details-card">
        <div className="product-details-image-wrap">
          <img
            className="product-details-image"
            src={product.image}
            alt={product.title}
          />
        </div>

        <div className="product-details-info">
          <p className="product-details-category">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="product-details-rating">
            <span aria-label={`${product.rating?.rate ?? "No"} out of 5 stars`}>
              ⭐ {product.rating?.rate ?? "N/A"}
            </span>
            {product.rating?.count != null && (
              <span>({product.rating.count} reviews)</span>
            )}
          </p>
          <p className="product-details-price">${product.price.toFixed(2)}</p>
          <p className="product-details-description">{product.description}</p>
          <button
            className="product-details-add-button"
            type="button"
            disabled={isCartUpdating}
            onClick={() => addToCart(product)}
          >
            {isCartUpdating ? (
              <Loading label="Adding..." inline />
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
