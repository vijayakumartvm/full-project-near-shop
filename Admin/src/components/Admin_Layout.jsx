
import React, { useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  UserRound,
  LogOut,
  Headset,
} from "lucide-react";

import Admin_Sidebar from "./Admin_Sidebar.jsx";
import "./Admin_Layout.css";

function Admin_Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const adminName =
    localStorage.getItem("nearshopAdminName") || "Administrator";

  useEffect(() => {
    if (localStorage.getItem("nearshopAdminLoggedIn") !== "true") {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeMenu = () => setMobileMenuOpen(false);

    window.addEventListener("nearshop:close-sidebar", closeMenu);

    return () => {
      window.removeEventListener("nearshop:close-sidebar", closeMenu);
    };
  }, []);

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/shop-approvals": "Shop Approvals",
    "/admin/sellers": "Sellers",
    "/admin/customers": "Customers",
    "/admin/categories": "Categories",
    "/admin/coupons": "Coupons",
    "/admin/payments": "Payments",
    "/admin/support": "Support",
    "/admin/reports": "Reports",
    "/admin/profile": "Admin Profile",
  };

  const handleLogout = () => {
    localStorage.removeItem("nearshopAdminLoggedIn");
    localStorage.removeItem("nearshopAdminName");
    localStorage.removeItem("nearshopAdminRemember");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="near-admin-layout">
      {mobileMenuOpen && (
        <button
          className="near-admin-overlay"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={mobileMenuOpen ? "admin-sidebar-open" : ""}>
        <Admin_Sidebar />
      </div>

      <div className="near-admin-main">
        <header className="near-admin-topbar">
          <button
            type="button"
            className="near-admin-menu-button"
            aria-label="Toggle sidebar"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="near-admin-topbar-title">
            <h2>{pageTitles[location.pathname] || "Dashboard"}</h2>
            <p>Manage your NearShop marketplace</p>
          </div>

          <form
            className="near-admin-search"
            onSubmit={(event) => {
              event.preventDefault();
              navigate("/admin/sellers");
            }}
          >
            <Search size={18} />
            <input
              type="search"
              placeholder="Search users, orders, products..."
              aria-label="Search marketplace"
            />
          </form>

          <div className="near-admin-topbar-actions">
            <div className="near-admin-dropdown-wrap">
              <button
                type="button"
                className="near-admin-icon-button"
                aria-label="Notifications"
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setProfileOpen(false);
                }}
              >
                <Bell size={19} />
                <span className="near-admin-notification-dot">3</span>
              </button>

              {notificationsOpen && (
                <div className="near-admin-dropdown">
                  <strong>Notifications</strong>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/shop-approvals")}
                  >
                    Review pending shop applications
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/support")}
                  >
                    View support requests
                  </button>
                </div>
              )}
            </div>

            <div className="near-admin-dropdown-wrap">
              <button
                type="button"
                className="near-admin-profile-button"
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
              >
                <span className="near-admin-avatar">
                  {adminName.charAt(0).toUpperCase()}
                </span>
                <span className="near-admin-profile-copy">
                  <strong>{adminName}</strong>
                  <small>Admin User</small>
                </span>
                <ChevronDown size={15} />
              </button>

              {profileOpen && (
                <div className="near-admin-dropdown near-admin-profile-dropdown">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/profile")}
                  >
                    <UserRound size={16} />
                    My Profile
                  </button>
                  <button type="button" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="near-admin-content">
          <div className="near-admin-page-heading">
            <h1>{pageTitles[location.pathname] || "Dashboard"}</h1>
            <p>Welcome back, {adminName}.</p>
          </div>

          <Outlet />
        </main>

        <footer className="near-admin-footer">
          <div className="near-admin-footer-brand">
            <strong>NearShop</strong>
            <span>Grocery Marketplace Admin</span>
          </div>

          <nav aria-label="Admin footer navigation">
            <button onClick={() => navigate("/admin/dashboard")}>
              Dashboard
            </button>
            <button onClick={() => navigate("/admin/shop-approvals")}>
              Shop Approvals
            </button>
            <button onClick={() => navigate("/admin/reports")}>
              Reports
            </button>
            <button onClick={() => navigate("/admin/support")}>
              <Headset size={14} /> Support
            </button>
          </nav>

          <small>© {new Date().getFullYear()} NearShop. All rights reserved.</small>
        </footer>
      </div>
    </div>
  );
}

export default Admin_Layout;
