
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Admin_Login from "./pages/Admin_Login.jsx";
import Admin_Dashboard from "./pages/Admin_Dashboard.jsx";
import Admin_Layout from "./components/Admin_Layout.jsx";
import Admin_ShopApprovals from "./pages/Admin_ShopApprovals.jsx";
import Admin_Sellers from "./pages/Admin_Sellers.jsx";
import Admin_Customers from "./pages/Admin_Customers.jsx";
import Admin_Categories from "./pages/Admin_Categories.jsx";
import Admin_Coupons from "./pages/Admin_Coupons.jsx";
import Admin_Support from "./pages/Admin_Support.jsx";
import Admin_Payments from "./pages/Admin_Payments.jsx";
import Admin_Reports from "./pages/Admin_Reports.jsx";
import Admin_Settings from "./pages/Admin_Settings.jsx";
import Admin_Profile from "./pages/Admin_Profile.jsx";

function Admin_PagePlaceholder({ title, description }) {
  return (
    <section className="admin-coming-page">
      <span className="admin-coming-eyebrow">NEARSHOP MANAGEMENT</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>
        This page will use the same NearShop dashboard design and
        responsive layout.
      </p>
    </section>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/admin/login" replace />}
      />

      <Route
        path="/admin/login"
        element={<Admin_Login />}
      />

      <Route path="/admin" element={<Admin_Layout />}>
        <Route
          index
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<Admin_Dashboard />}
        />

        <Route
  path="shop-approvals"
  element={<Admin_ShopApprovals />}
/>
<Route path="sellers" element={<Admin_Sellers />} />

       <Route path="customers" element={<Admin_Customers />} />

       
<Route path="categories" element={<Admin_Categories />} />


       <Route path="coupons" element={<Admin_Coupons />} />

<Route path="payments" element={<Admin_Payments />} />


     
<Route path="support" element={<Admin_Support />} />


        
<Route path="reports" element={<Admin_Reports />} />


        <Route path="profile" element={<Admin_Profile />} />

<Route path="settings" element={<Admin_Settings />} />


      </Route>
      



      <Route
        path="*"
        element={<Navigate to="/admin/login" replace />}
      />
    </Routes>
  );
}

export default App;
