
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Leaf,
} from "lucide-react";
import "./Admin_Login.css";
import heroBackground from "../assets/images/hero-background.png";
import shopLogo from "../assets/images/shop-name1.png";

function Admin_Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Demo login only. Replace with backend authentication later.
    if (
      cleanEmail === "admin@nearshop.com" &&
      password === "Admin@123"
    ) {
      localStorage.setItem("nearshopAdminLoggedIn", "true");
      localStorage.setItem("nearshopAdminName", "Administrator");

      if (rememberMe) {
        localStorage.setItem("nearshopAdminRemember", "true");
      } else {
        localStorage.removeItem("nearshopAdminRemember");
      }

      navigate("/admin/dashboard", { replace: true });
    } else {
      setError("Incorrect email or password. Please try again.");
    }
  };

  return (
    <div className="near-login-page">
      <header className="near-login-navbar">
        <Link to="/admin/login" className="near-login-brand">
          <img
  src={shopLogo}
  alt="NearShop logo"
  className="near-login-brand-image"
/>
        </Link>

        <div className="near-login-navbar-right">
          <span className="near-login-portal-label">
            ADMIN PORTAL
          </span>
          <span className="near-login-secure">
            <ShieldCheck size={17} />
            Secure Login
          </span>
        </div>
      </header>

      <main className="near-login-main">
        <div className="near-login-card">
          <section className="near-login-visual">
           <img
  src={heroBackground}
  alt="Fresh groceries"
  className="near-login-background-image"
/>

            <div className="near-login-image-overlay" />

            <div className="near-login-visual-content">
              <span className="near-login-tag">
                <Leaf size={15} />
                FRESHNESS STARTS HERE
              </span>

              <h1>
                Manage your
                <br />
                marketplace
                <br />
                <span>with confidence.</span>
              </h1>

              <p>
                Manage local grocery stores, seller registrations,
                customers, orders, and marketplace performance
                from one place.
              </p>

              <div className="near-login-feature">
                <ShieldCheck size={24} />
                <div>
                  <strong>Admin control centre</strong>
                  <small>
                    Everything your grocery marketplace needs in one place.
                  </small>
                </div>
              </div>

              <div className="near-login-image-footer">
                <span>FRESH FOOD</span>
                <span>•</span>
                <span>LOCAL SELLERS</span>
                <span>•</span>
                <span>BETTER SHOPPING</span>
              </div>
            </div>
          </section>

          <section className="near-login-form-section">
            <div className="near-login-form-inner">
              <div className="near-login-mobile-brand">
                <img
                  src="/assets/images/shop-name1.png"
                  alt="NearShop"
                />
              </div>

              <div className="near-login-heading">
                <span>WELCOME BACK</span>
                <h2>Admin Login</h2>
                <p>Sign in to manage your marketplace.</p>
              </div>

              <form className="near-login-form" onSubmit={handleSubmit}>
                <div className="near-login-field">
                  <label htmlFor="admin-email">Email Address</label>

                  <div className="near-login-input">
                    <Mail size={18} />

                    <input
                      id="admin-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      placeholder="Enter your admin email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="near-login-field">
                  <label htmlFor="admin-password">Password</label>

                  <div className="near-login-input">
                    <LockKeyhole size={18} />

                    <input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      required
                    />

                    <button
                      type="button"
                      className="near-login-eye"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="near-login-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                    />
                    Remember me
                  </label>
                  <span>Authorised administrators only</span>
                </div>

                {error && (
                  <p className="near-login-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="near-login-submit">
                  Sign In to Dashboard
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="near-login-divider">
                <span>SECURE ADMIN ACCESS</span>
              </div>

              <div className="near-login-security-note">
                <ShieldCheck size={19} />
                <p>
                  This portal is intended for authorised NearShop
                  administrators.
                </p>
              </div>

              <div className="near-login-demo">
                <strong>Demo credentials</strong>
                <span>Email: admin@nearshop.com</span>
                <span>Password: Admin@123</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="near-login-footer">
        <div className="near-login-footer-brand">
          <strong>NearShop</strong>
          <span>Grocery Marketplace</span>
        </div>

        <span>
          © {new Date().getFullYear()} NearShop. All rights reserved.
        </span>

        <a href="mailto:support@nearshop.com">Contact Support</a>
      </footer>
    </div>
  );
}

export default Admin_Login;
