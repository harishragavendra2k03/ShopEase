import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import "./Register.css";

function Register() {
  const { user, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to="/" replace />;

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      register({ name, email, password });
      toast.success("Your account has been created.");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" noValidate onSubmit={handleSubmit}>
        <p className="auth-eyebrow">Join ShopEase</p>
        <h1>Sign Up</h1>
        <label className="auth-field" htmlFor="register-name">
          Name
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label className="auth-field" htmlFor="register-email">
          Email
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="auth-field" htmlFor="register-password">
          Password
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>
        <button className="auth-submit" type="submit">Sign Up</button>
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" state={location.state}>Log in</Link>
        </p>
        {/* <p className="auth-demo-note">
          Demo only: account credentials are stored in this browser.
        </p> */}
      </form>
    </main>
  );
}

export default Register;
