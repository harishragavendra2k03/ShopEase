import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProduct, { useCategories } from "../hooks/useProducts";
import { getApiErrorMessage } from "../services/apiErrors";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/useCart";
import { useWishlist } from "../context/useWishlist";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import "./Product.css";

function Products() {
  const {
    data,
    error: productsError,
    isLoading,
    isError,
    refetch: refetchProducts,
    isFetching: isFetchingProducts,
  } = useProduct();
  const {
    data: categories = [],
    error: categoriesError,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
    isFetching: isFetchingCategories,
  } = useCategories();
  const { search, setSearch } = useSearch();
  const { addToCart, isCartUpdating } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");

  useEffect(() => {
    if (productsError) toast.error(getApiErrorMessage(productsError));
  }, [productsError]);

  useEffect(() => {
    if (categoriesError) toast.error(getApiErrorMessage(categoriesError));
  }, [categoriesError]);

  if (isLoading) return <Loading label="Loading products..." />;

  if (isError) {
    return (
      <section className="api-error-state" role="alert">
        <h2>Unable to load products</h2>
        <p>{getApiErrorMessage(productsError)}</p>
        <button
          type="button"
          onClick={() => refetchProducts()}
          disabled={isFetchingProducts}
        >
          {isFetchingProducts ? "Retrying..." : "Try again"}
        </button>
      </section>
    );
  }

  let filteredProducts = data.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filteredProducts.sort(
      (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0),
    );
  }

  return (
    <div className="products-page">
      <h1>Our Products</h1>

      <div className="product-controls">
        <div className="product-control-group">
          <label htmlFor="category-filter">Category</label>
          <div className="product-select-wrap">
            <select
              id="category-filter"
              className="product-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isCategoriesLoading || isCategoriesError}
            >
              <option value="all">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {isCategoriesError && (
            <div className="category-error" role="alert">
              <p>{getApiErrorMessage(categoriesError)}</p>
              <button
                type="button"
                onClick={() => refetchCategories()}
                disabled={isFetchingCategories}
              >
                {isFetchingCategories ? "Retrying..." : "Retry categories"}
              </button>
            </div>
          )}
        </div>

        <div className="product-control-group">
          <label htmlFor="product-sort">Sort by</label>
          <div className="product-select-wrap">
            <select
              id="product-sort"
              className="product-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Rating: Highest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              className="product-card"
              key={product.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/product/${product.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/product/${product.id}`);
                }
              }}
            >
              <button
                className={`product-wishlist-button${isInWishlist(product.id) ? " is-wishlisted" : ""}`}
                type="button"
                aria-label={`${isInWishlist(product.id) ? "Remove" : "Add"} ${product.title} ${isInWishlist(product.id) ? "from" : "to"} wishlist`}
                aria-pressed={isInWishlist(product.id)}
                onClick={(event) => {
                  event.stopPropagation();
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                    toast.success(`${product.title} removed from wishlist`);
                  } else {
                    addToWishlist(product);
                    toast.success(`${product.title} added to wishlist`);
                  }
                }}
              >
                {isInWishlist(product.id) ? "♥" : "♡"}
              </button>
              <img src={product.image} alt={product.title} />

              <h3>{product.title}</h3>

              <p className="category">{product.category}</p>

              <p className="price">
                ${product.price.toFixed(2)}
              </p>

              <p>⭐ {product.rating?.rate ?? "N/A"}</p>

              <button
                type="button"
                disabled={isCartUpdating}
                onClick={(event) => {
                  event.stopPropagation();
                  addToCart(product);
                }}
              >
                {isCartUpdating ? (
                  <Loading label="Adding..." inline />
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          ))
        ) : (
          <EmptyState
            className="empty-state-products"
            icon="🔎"
            title="No products found"
            description="Try a different search or clear your filters to see all products."
            actionLabel="Clear filters"
            onAction={() => {
              setSearch("");
              setCategory("all");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Products;
