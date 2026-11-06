import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";
import { useWishlist } from "../context/useWishlist";
import "./Profile.css";

function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: { pathname: "/profile" } }} />;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      updateProfile({ name, email });
      toast.success("Your profile has been updated.");
    } catch (error) {
      toast.error(error.message || "Unable to update your profile.");
    }
  }

  function handleLogout() {
    clearCart();
    clearWishlist();
    logout();
    toast.success("You have been logged out.");
    navigate("/login");
  }

  return (
    <main className="profile-page">
      <form className="profile-card" noValidate onSubmit={handleSubmit}>
        <p className="profile-eyebrow">Your ShopEase account</p>
        <h1>Profile</h1>
        <label className="profile-field" htmlFor="profile-name">
          Name
          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label className="profile-field" htmlFor="profile-email">
          Email
          <input
            id="profile-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <div className="profile-actions">
          <button className="profile-save-button" type="submit">
            Save changes
          </button>
          <button
            className="profile-logout-button"
            type="button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </form>
    </main>
  );
}

export default Profile;
