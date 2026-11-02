
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  Store,
  Users,
  Shapes,
  TicketPercent,
  Wallet,
  Headset,
  ChartNoAxesCombined,
  UserRound,
  LogOut,
  ChevronRight,
} from "lucide-react";

import shopLogo from "../assets/images/shop-name1.png";
import "./Admin_Sidebar.css";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Shop Approvals", path: "/admin/shop-approvals", icon: ClipboardCheck },
  { label: "Sellers", path: "/admin/sellers", icon: Store },
  { label: "Customers", path: "/admin/customers", icon: Users },
  { label: "Categories", path: "/admin/categories", icon: Shapes },
  { label: "Coupons", path: "/admin/coupons", icon: TicketPercent },
  { label: "Payments", path: "/admin/payments", icon: Wallet },
  { label: "Support", path: "/admin/support", icon: Headset },
  { label: "Reports", path: "/admin/reports", icon: ChartNoAxesCombined },
  { label: "Admin Profile", path: "/admin/profile", icon: UserRound },
  { label: "Settings", path: "/admin/settings", icon: UserRound },
];

function Admin_Sidebar() {
  const navigate = useNavigate();

  const closeMobileMenu = () => {
    window.dispatchEvent(new Event("nearshop:close-sidebar"));
  };

  const handleLogout = () => {
    localStorage.removeItem("nearshopAdminLoggedIn");
    localStorage.removeItem("nearshopAdminName");
    localStorage.removeItem("nearshopAdminRemember");
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="ns-admin-sidebar">
      <NavLink
        to="/admin/dashboard"
        className="ns-admin-brand"
        onClick={closeMobileMenu}
      >
        <img
          src={shopLogo}
          alt="NearShop"
          className="ns-admin-brand-image"
        />
        <span className="ns-admin-brand-copy">
          <small>GROCERY MARKETPLACE</small>
          <strong>Admin Panel</strong>
        </span>
      </NavLink>

      <div className="ns-admin-menu-label">MAIN MENU</div>

      <nav className="ns-admin-navigation" aria-label="Admin navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `ns-admin-navigation-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} className="ns-admin-navigation-icon" />
              <span className="ns-admin-link-label">{item.label}</span>
              <ChevronRight size={14} className="ns-admin-link-chevron" />
            </NavLink>
          );
        })}
      </nav>

      <div className="ns-admin-sidebar-bottom">
        <div className="ns-admin-sidebar-promo">
          <span className="ns-admin-promo-icon">
            <Store size={20} />
          </span>
          <h3>Need Help?</h3>
          <p>Contact our support team for help with your marketplace.</p>
          <button
            type="button"
            onClick={() => {
              navigate("/admin/support");
              closeMobileMenu();
            }}
          >
            Get Support <ChevronRight size={15} />
          </button>
        </div>

        <button
          type="button"
          className="ns-admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        <div className="ns-admin-sidebar-footer">
          © {new Date().getFullYear()} NearShop
        </div>
      </div>
    </aside>
  );
}

export default Admin_Sidebar;
