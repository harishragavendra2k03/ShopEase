import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import "./Login.css";

function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to="/" replace />;

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      login({ email, password });
      toast.success("You are now logged in.");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" noValidate onSubmit={handleSubmit}>
        <p className="auth-eyebrow">Welcome back</p>
        <h1>Log in to ShopEase</h1>
        <label className="auth-field" htmlFor="login-email">
          Email
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="auth-field" htmlFor="login-password">
          Password
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button className="auth-submit" type="submit">Log in</button>
        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register" state={location.state}>Create one</Link>
        </p>
        {/* <p className="auth-demo-note">
          Demo only: account credentials are stored in this browser.
        </p> */}
      </form>
    </main>
  );
}

export default Login;
