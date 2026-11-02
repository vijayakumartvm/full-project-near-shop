
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  TicketPercent,
  CheckCircle2,
  Clock3,
  Tag,
  Copy,
  Wallet,
  Film,
  ShoppingBasket,
  RefreshCw,
  ArrowDownRight,
  ShieldCheck,
  BadgeIndianRupee,
} from "lucide-react";
import "./Admin_Coupons.css";

const COUPON_KEY = "nearshopAdminCoupons";
const CREDIT_KEY = "nearshopAdminWalletCredits";

const defaultCoupons = [
  {
    id: 1,
    code: "ORDER2000",
    title: "₹2,000 Grocery Savings",
    description: "₹2,000 off an eligible order of ₹10,000 or more.",
    type: "fixed",
    value: 2000,
    minOrder: 10000,
    maxDiscount: 0,
    usageLimit: 500,
    usedCount: 84,
    expiresOn: "2027-03-31",
    status: "Active",
  },
  {
    id: 2,
    code: "ORDER5000",
    title: "₹5,000 Grocery Savings",
    description: "₹5,000 off an eligible order of ₹20,000 or more.",
    type: "fixed",
    value: 5000,
    minOrder: 20000,
    maxDiscount: 0,
    usageLimit: 300,
    usedCount: 37,
    expiresOn: "2027-03-31",
    status: "Active",
  },
  {
    id: 3,
    code: "ORDER10000",
    title: "₹10,000 Grocery Savings",
    description: "₹10,000 off an eligible order of ₹50,000 or more.",
    type: "fixed",
    value: 10000,
    minOrder: 50000,
    maxDiscount: 0,
    usageLimit: 150,
    usedCount: 12,
    expiresOn: "2027-03-31",
    status: "Active",
  },
  {
    id: 4,
    code: "ORDER20000",
    title: "₹20,000 Grocery Savings",
    description: "₹20,000 off an eligible order of ₹1,00,000 or more.",
    type: "fixed",
    value: 20000,
    minOrder: 100000,
    maxDiscount: 0,
    usageLimit: 75,
    usedCount: 5,
    expiresOn: "2027-03-31",
    status: "Active",
  },
  {
    id: 5,
    code: "WELCOME10",
    title: "Welcome Offer",
    description: "10% off an eligible new-customer order.",
    type: "percentage",
    value: 10,
    minOrder: 500,
    maxDiscount: 100,
    usageLimit: 1000,
    usedCount: 210,
    expiresOn: "2027-03-31",
    status: "Active",
  },
];

const defaultCredits = [
  {
    id: 1,
    customerName: "Demo Customer",
    email: "customer@example.com",
    ticketReference: "DEMO-TICKET-001",
    source: "Movie ticket voucher",
    amount: 300,
    balance: 300,
    issuedOn: "2026-10-22",
    expiresOn: "2026-12-31",
    verified: true,
    status: "Available",
  },
];

const emptyCoupon = {
  code: "",
  title: "",
  description: "",
  type: "fixed",
  value: "2000",
  minOrder: "10000",
  maxDiscount: "0",
  usageLimit: "100",
  expiresOn: "2027-03-31",
  status: "Active",
};

const emptyCredit = {
  customerName: "",
  email: "",
  ticketReference: "",
  amount: "300",
  expiresOn: "2026-12-31",
  verification: "no",
};

function todayString() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return fallback;
  }
}

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function couponStatus(coupon) {
  if (coupon.expiresOn < todayString()) return "Expired";
  return coupon.status;
}

function creditStatus(credit) {
  if (Number(credit.balance) <= 0) return "Redeemed";
  if (credit.expiresOn < todayString()) return "Expired";
  return "Available";
}

function discountLabel(coupon) {
  return coupon.type === "percentage"
    ? `${coupon.value}% OFF`
    : `${formatMoney(coupon.value)} OFF`;
}

export default function Admin_Coupons() {
  const [coupons, setCoupons] = useState(() =>
    readStorage(COUPON_KEY, defaultCoupons)
  );
  const [credits, setCredits] = useState(() =>
    readStorage(CREDIT_KEY, defaultCredits)
  );

  const [activeTab, setActiveTab] = useState("coupons");
  const [couponSearch, setCouponSearch] = useState("");
  const [couponStatusFilter, setCouponStatusFilter] = useState("All");
  const [creditSearch, setCreditSearch] = useState("");
  const [creditStatusFilter, setCreditStatusFilter] = useState("All");

  const [modalType, setModalType] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [couponForm, setCouponForm] = useState(emptyCoupon);
  const [creditForm, setCreditForm] = useState(emptyCredit);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  // Demonstration-only checkout calculator.
  const [demoOrderTotal, setDemoOrderTotal] = useState("6000");
  const [demoWalletAmount, setDemoWalletAmount] = useState("300");

  useEffect(() => {
    localStorage.setItem(COUPON_KEY, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(CREDIT_KEY, JSON.stringify(credits));
  }, [credits]);

  const filteredCoupons = useMemo(() => {
    const query = couponSearch.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const matchesSearch =
        coupon.code.toLowerCase().includes(query) ||
        coupon.title.toLowerCase().includes(query) ||
        (coupon.description || "").toLowerCase().includes(query);

      const matchesStatus =
        couponStatusFilter === "All" ||
        couponStatus(coupon) === couponStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, couponSearch, couponStatusFilter]);

  const filteredCredits = useMemo(() => {
    const query = creditSearch.trim().toLowerCase();

    return credits.filter((credit) => {
      const matchesSearch =
        credit.customerName.toLowerCase().includes(query) ||
        credit.email.toLowerCase().includes(query) ||
        credit.ticketReference.toLowerCase().includes(query);

      const matchesStatus =
        creditStatusFilter === "All" ||
        creditStatus(credit) === creditStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [credits, creditSearch, creditStatusFilter]);

  const activeCoupons = coupons.filter(
    (coupon) => couponStatus(coupon) === "Active"
  ).length;

  const expiredCoupons = coupons.filter(
    (coupon) => couponStatus(coupon) === "Expired"
  ).length;

  const redemptions = coupons.reduce(
    (sum, coupon) => sum + Number(coupon.usedCount || 0),
    0
  );

  const availableCreditBalance = credits.reduce(
    (sum, credit) =>
      creditStatus(credit) === "Available"
        ? sum + Number(credit.balance || 0)
        : sum,
    0
  );

  const orderValue = Math.max(0, Number(demoOrderTotal) || 0);
  const requestedCredit = Math.max(0, Number(demoWalletAmount) || 0);
  const appliedDemoCredit = Math.min(orderValue, requestedCredit);
  const payableAmount = Math.max(0, orderValue - appliedDemoCredit);

  function notify(message) {
    setNotice(message);
  }

  function openCreateCoupon() {
    setEditingId(null);
    setCouponForm({
      ...emptyCoupon,
      expiresOn: `${new Date().getFullYear() + 1}-03-31`,
    });
    setFormError("");
    setModalType("coupon");
  }

  function openEditCoupon(coupon) {
    setEditingId(coupon.id);
    setCouponForm({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description || "",
      type: coupon.type,
      value: String(coupon.value),
      minOrder: String(coupon.minOrder),
      maxDiscount: String(coupon.maxDiscount || 0),
      usageLimit: String(coupon.usageLimit),
      expiresOn: coupon.expiresOn,
      status: coupon.status,
    });
    setFormError("");
    setModalType("coupon");
  }

  function openCreditModal() {
    setCreditForm({ ...emptyCredit });
    setFormError("");
    setModalType("credit");
  }

  function closeModal() {
    setModalType(null);
    setEditingId(null);
    setCouponForm({ ...emptyCoupon });
    setCreditForm({ ...emptyCredit });
    setFormError("");
  }

  function submitCoupon(event) {
    event.preventDefault();

    const code = couponForm.code.trim().toUpperCase().replace(/\s+/g, "");
    const title = couponForm.title.trim();
    const value = Number(couponForm.value);
    const minOrder = Number(couponForm.minOrder);
    const maxDiscount =
      couponForm.type === "percentage"
        ? Number(couponForm.maxDiscount)
        : 0;
    const usageLimit = Number(couponForm.usageLimit);

    if (!/^[A-Z0-9_-]{3,25}$/.test(code)) {
      setFormError("Use 3–25 letters, numbers, hyphens or underscores.");
      return;
    }

    if (!title) {
      setFormError("Enter a coupon title.");
      return;
    }

    if (!Number.isFinite(value) || value <= 0) {
      setFormError("Discount must be greater than zero.");
      return;
    }

    if (couponForm.type === "percentage" && value > 100) {
      setFormError("Percentage discount cannot exceed 100%.");
      return;
    }

    if (!Number.isFinite(minOrder) || minOrder < 0) {
      setFormError("Minimum order cannot be negative.");
      return;
    }

    if (
      couponForm.type === "percentage" &&
      (!Number.isFinite(maxDiscount) || maxDiscount < 0)
    ) {
      setFormError("Maximum discount cannot be negative.");
      return;
    }

    if (!Number.isInteger(usageLimit) || usageLimit < 1) {
      setFormError("Usage limit must be a positive whole number.");
      return;
    }

    if (!couponForm.expiresOn || couponForm.expiresOn < todayString()) {
      setFormError("Choose today or a future expiry date.");
      return;
    }

    if (
      coupons.some(
        (item) =>
          item.code.toUpperCase() === code && item.id !== editingId
      )
    ) {
      setFormError("This coupon code already exists.");
      return;
    }

    const existing = coupons.find((item) => item.id === editingId);

    if (existing && usageLimit < Number(existing.usedCount || 0)) {
      setFormError("Usage limit cannot be lower than usage already recorded.");
      return;
    }

    const data = {
      code,
      title,
      description: couponForm.description.trim(),
      type: couponForm.type,
      value,
      minOrder,
      maxDiscount,
      usageLimit,
      usedCount: existing?.usedCount || 0,
      expiresOn: couponForm.expiresOn,
      status: couponForm.status,
    };

    if (editingId !== null) {
      setCoupons((previous) =>
        previous.map((item) =>
          item.id === editingId ? { ...item, ...data } : item
        )
      );
      notify("Coupon updated in the demo.");
    } else {
      setCoupons((previous) => [{ id: Date.now(), ...data }, ...previous]);
      notify("Coupon created in the demo.");
    }

    closeModal();
  }

  function submitCredit(event) {
    event.preventDefault();

    const name = creditForm.customerName.trim();
    const email = creditForm.email.trim().toLowerCase();
    const ticketReference = creditForm.ticketReference.trim();
    const amount = Number(creditForm.amount);

    if (!name) {
      setFormError("Enter the customer's name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter a valid customer email address.");
      return;
    }

    if (!ticketReference) {
      setFormError("Enter the movie-ticket booking or voucher reference.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Credit amount must be greater than zero.");
      return;
    }

    if (creditForm.expiresOn < todayString()) {
      setFormError("Choose today or a future expiry date.");
      return;
    }

    if (creditForm.verification !== "yes") {
      setFormError(
        "Verify eligibility with the ticket provider before issuing credit."
      );
      return;
    }

    const duplicateReference = credits.some(
      (credit) =>
        credit.ticketReference.toLowerCase() ===
        ticketReference.toLowerCase()
    );

    if (duplicateReference) {
      setFormError(
        "This ticket reference has already been credited in this demo."
      );
      return;
    }

    const newCredit = {
      id: Date.now(),
      customerName: name,
      email,
      ticketReference,
      source: "Movie ticket voucher",
      amount,
      balance: amount,
      issuedOn: todayString(),
      expiresOn: creditForm.expiresOn,
      verified: true,
      status: "Available",
    };

    setCredits((previous) => [newCredit, ...previous]);
    closeModal();
    setActiveTab("wallet");
    notify(`${formatMoney(amount)} demo wallet credit issued to ${email}.`);
  }

  function toggleCoupon(id) {
    setCoupons((previous) =>
      previous.map((coupon) =>
        coupon.id === id
          ? {
              ...coupon,
              status: coupon.status === "Active" ? "Inactive" : "Active",
            }
          : coupon
      )
    );
    notify("Coupon status updated in the demo.");
  }

  function deleteCoupon(coupon) {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;

    setCoupons((previous) =>
      previous.filter((item) => item.id !== coupon.id)
    );
    notify("Coupon deleted from the demo.");
  }

  function redeemDemoCredit(credit) {
    if (creditStatus(credit) !== "Available") return;

    const confirmed = window.confirm(
      `Mark ${formatMoney(credit.balance)} from ${credit.email} as used in this demo?`
    );

    if (!confirmed) return;

    setCredits((previous) =>
      previous.map((item) =>
        item.id === credit.id
          ? { ...item, balance: 0, status: "Redeemed" }
          : item
      )
    );

    notify("Demo credit marked as redeemed.");
  }

  function deleteCredit(credit) {
    if (!window.confirm(`Delete credit record ${credit.ticketReference}?`)) {
      return;
    }

    setCredits((previous) =>
      previous.filter((item) => item.id !== credit.id)
    );
    notify("Credit record deleted from the demo.");
  }

  async function copyCode(code) {
    try {
      await navigator.clipboard.writeText(code);
      notify(`Coupon ${code} copied.`);
    } catch {
      notify(`Coupon code: ${code}`);
    }
  }

  function resetDemo() {
    if (
      !window.confirm(
        "Reset coupon and wallet credit data to the sample demo records?"
      )
    ) {
      return;
    }

    setCoupons(defaultCoupons);
    setCredits(defaultCredits);
    setCouponSearch("");
    setCreditSearch("");
    setCouponStatusFilter("All");
    setCreditStatusFilter("All");
    notify("Sample coupon and credit records restored.");
  }

  return (
    <div className="acpn-page">
      <div className="acpn-heading">
        <div>
          <p className="acpn-eyebrow">MARKETING & CUSTOMER REWARDS</p>
          <h1>Coupons & Wallet Credits</h1>
          <p className="acpn-subtitle">
            Manage grocery discounts and eligible partner voucher credits.
          </p>
        </div>

        <button
          type="button"
          className="acpn-secondary-btn"
          onClick={resetDemo}
        >
          <RefreshCw size={16} />
          Reset demo
        </button>
      </div>

      {notice && (
        <div className="acpn-notice" role="status">
          <CheckCircle2 size={17} />
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="acpn-stats-grid">
        <div className="acpn-stat-card">
          <div className="acpn-stat-icon acpn-green">
            <TicketPercent size={21} />
          </div>
          <div>
            <p>Total coupons</p>
            <h2>{coupons.length}</h2>
            <span>Purchase discount offers</span>
          </div>
        </div>

        <div className="acpn-stat-card">
          <div className="acpn-stat-icon acpn-blue">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <p>Active coupons</p>
            <h2>{activeCoupons}</h2>
            <span>Enabled and not expired</span>
          </div>
        </div>

        <div className="acpn-stat-card">
          <div className="acpn-stat-icon acpn-purple">
            <Tag size={21} />
          </div>
          <div>
            <p>Coupon redemptions</p>
            <h2>{redemptions.toLocaleString("en-IN")}</h2>
            <span>Sample usage data</span>
          </div>
        </div>

        <div className="acpn-stat-card">
          <div className="acpn-stat-icon acpn-orange">
            <Wallet size={21} />
          </div>
          <div>
            <p>Available wallet credits</p>
            <h2>{formatMoney(availableCreditBalance)}</h2>
            <span>Sample balances not yet used</span>
          </div>
        </div>
      </div>

      <div className="acpn-tabs" role="tablist" aria-label="Coupon management">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "coupons"}
          className={activeTab === "coupons" ? "acpn-tab active" : "acpn-tab"}
          onClick={() => setActiveTab("coupons")}
        >
          <TicketPercent size={17} />
          Purchase coupons
          <span>{coupons.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "wallet"}
          className={activeTab === "wallet" ? "acpn-tab active" : "acpn-tab"}
          onClick={() => setActiveTab("wallet")}
        >
          <Wallet size={17} />
          Movie-ticket wallet credits
          <span>{credits.length}</span>
        </button>
      </div>

      {activeTab === "coupons" && (
        <section className="acpn-panel">
          <div className="acpn-panel-heading">
            <div>
              <h2>Purchase discount coupons</h2>
              <p>
                Example: spend ₹10,000 and save ₹2,000 with an eligible coupon.
              </p>
            </div>

            <button
              type="button"
              className="acpn-primary-btn"
              onClick={openCreateCoupon}
            >
              <Plus size={17} />
              Create coupon
            </button>
          </div>

          <div className="acpn-tier-grid">
            {[
              { threshold: 10000, discount: 2000, code: "ORDER2000" },
              { threshold: 20000, discount: 5000, code: "ORDER5000" },
              { threshold: 50000, discount: 10000, code: "ORDER10000" },
              { threshold: 100000, discount: 20000, code: "ORDER20000" },
            ].map((tier) => (
              <div className="acpn-tier-card" key={tier.code}>
                <div className="acpn-tier-icon">
                  <BadgeIndianRupee size={21} />
                </div>
                <p>Minimum order {formatMoney(tier.threshold)}</p>
                <h3>{formatMoney(tier.discount)} OFF</h3>
                <span>{tier.code}</span>
              </div>
            ))}
          </div>

          <div className="acpn-toolbar">
            <div className="acpn-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search coupon code or title..."
                value={couponSearch}
                onChange={(event) => setCouponSearch(event.target.value)}
                aria-label="Search coupons"
              />
            </div>

            <select
              className="acpn-filter"
              value={couponStatusFilter}
              onChange={(event) =>
                setCouponStatusFilter(event.target.value)
              }
              aria-label="Filter coupons by status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="acpn-table-wrap">
            <table className="acpn-table">
              <thead>
                <tr>
                  <th>Coupon</th>
                  <th>Offer</th>
                  <th>Minimum order</th>
                  <th>Usage</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCoupons.map((coupon) => {
                  const status = couponStatus(coupon);
                  const limit = Number(coupon.usageLimit) || 0;
                  const used = Number(coupon.usedCount) || 0;
                  const usagePercent =
                    limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

                  return (
                    <tr key={coupon.id}>
                      <td>
                        <div className="acpn-coupon-info">
                          <div className="acpn-coupon-icon">
                            <TicketPercent size={19} />
                          </div>
                          <div className="acpn-coupon-text">
                            <strong>{coupon.title}</strong>
                            <button
                              type="button"
                              className="acpn-code-copy"
                              onClick={() => copyCode(coupon.code)}
                            >
                              {coupon.code}
                              <Copy size={12} />
                            </button>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="acpn-discount-badge">
                          {discountLabel(coupon)}
                        </span>
                        {coupon.type === "percentage" &&
                          Number(coupon.maxDiscount) > 0 && (
                            <small className="acpn-cell-hint">
                              Max {formatMoney(coupon.maxDiscount)}
                            </small>
                          )}
                      </td>

                      <td className="acpn-money">
                        {formatMoney(coupon.minOrder)}
                      </td>

                      <td>
                        <div className="acpn-usage">
                          <div className="acpn-usage-label">
                            <strong>{used}</strong> / {limit}
                          </div>
                          <div className="acpn-progress-track">
                            <span style={{ width: `${usagePercent}%` }} />
                          </div>
                        </div>
                      </td>

                      <td className="acpn-date">
                        {formatDate(coupon.expiresOn)}
                      </td>

                      <td>
                        <span
                          className={`acpn-status acpn-status-${status.toLowerCase()}`}
                        >
                          <span />
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="acpn-row-actions">
                          <button
                            type="button"
                            className="acpn-icon-btn"
                            onClick={() => openEditCoupon(coupon)}
                            aria-label={`Edit ${coupon.code}`}
                            title="Edit coupon"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            className="acpn-icon-btn"
                            onClick={() => toggleCoupon(coupon.id)}
                            aria-label={`Toggle ${coupon.code}`}
                            title="Activate or deactivate"
                          >
                            {coupon.status === "Active" ? (
                              <span className="acpn-toggle-word">OFF</span>
                            ) : (
                              <span className="acpn-toggle-word">ON</span>
                            )}
                          </button>

                          <button
                            type="button"
                            className="acpn-icon-btn acpn-delete-btn"
                            onClick={() => deleteCoupon(coupon)}
                            aria-label={`Delete ${coupon.code}`}
                            title="Delete coupon"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredCoupons.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      <div className="acpn-empty">
                        <TicketPercent size={30} />
                        <h3>No coupons found</h3>
                        <p>Change the search or filter to see more coupons.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="acpn-demo-note">
            <ShieldCheck size={15} />
            These are sample coupons. Server-side checkout validation is
            required before offering real discounts.
            {expiredCoupons > 0 &&
              ` ${expiredCoupons} coupon(s) have expired.`}
          </p>
        </section>
      )}

      {activeTab === "wallet" && (
        <section className="acpn-panel">
          <div className="acpn-panel-heading">
            <div>
              <h2>Movie-ticket wallet credits</h2>
              <p>
                Track eligible ticket refunds or partner vouchers issued to
                NearShop customers.
              </p>
            </div>

            <button
              type="button"
              className="acpn-primary-btn"
              onClick={openCreditModal}
            >
              <Plus size={17} />
              Issue wallet credit
            </button>
          </div>

          <div className="acpn-wallet-explainer">
            <div className="acpn-wallet-illustration">
              <Film size={28} />
              <ArrowDownRight size={17} />
              <Wallet size={28} />
            </div>
            <div className="acpn-wallet-message">
              <h3>From eligible ticket voucher to grocery wallet</h3>
              <p>
                Verify the booking with the ticket provider, then issue the
                approved credit to the matching customer account. The wallet
                balance can later be applied to an eligible grocery order.
              </p>
            </div>
            <div className="acpn-wallet-amount">
              <span>Example credit</span>
              <strong>₹300</strong>
            </div>
          </div>

          <div className="acpn-checkout-preview">
            <div className="acpn-checkout-preview-title">
              <div className="acpn-checkout-icon">
                <ShoppingBasket size={21} />
              </div>
              <div>
                <h3>Example grocery checkout</h3>
                <p>Illustrative calculation, not a real payment.</p>
              </div>
            </div>

            <div className="acpn-checkout-inputs">
              <label className="acpn-field">
                <span>Grocery order total (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={demoOrderTotal}
                  onChange={(event) => setDemoOrderTotal(event.target.value)}
                />
              </label>

              <label className="acpn-field">
                <span>Wallet credit to apply (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={demoWalletAmount}
                  onChange={(event) => setDemoWalletAmount(event.target.value)}
                />
              </label>
            </div>

            <div className="acpn-calculation">
              <div>
                <span>Order subtotal</span>
                <strong>{formatMoney(orderValue)}</strong>
              </div>
              <div className="acpn-calculation-credit">
                <span>Wallet credit applied</span>
                <strong>− {formatMoney(appliedDemoCredit)}</strong>
              </div>
              <div className="acpn-calculation-total">
                <span>Example amount payable</span>
                <strong>{formatMoney(payableAmount)}</strong>
              </div>
              {requestedCredit > orderValue && (
                <p className="acpn-calculation-hint">
                  Credit applied is limited to the order subtotal in this
                  example.
                </p>
              )}
            </div>
          </div>

          <div className="acpn-toolbar">
            <div className="acpn-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search customer, email or ticket reference..."
                value={creditSearch}
                onChange={(event) => setCreditSearch(event.target.value)}
                aria-label="Search wallet credits"
              />
            </div>

            <select
              className="acpn-filter"
              value={creditStatusFilter}
              onChange={(event) => setCreditStatusFilter(event.target.value)}
              aria-label="Filter wallet credits by status"
            >
              <option value="All">All statuses</option>
              <option value="Available">Available</option>
              <option value="Redeemed">Redeemed</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="acpn-table-wrap">
            <table className="acpn-table acpn-credit-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Source / reference</th>
                  <th>Issued amount</th>
                  <th>Remaining balance</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCredits.map((credit) => {
                  const status = creditStatus(credit);

                  return (
                    <tr key={credit.id}>
                      <td>
                        <div className="acpn-customer-info">
                          <div className="acpn-customer-avatar">
                            {credit.customerName.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <strong>{credit.customerName}</strong>
                            <span>{credit.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="acpn-reference">
                          <strong>{credit.source}</strong>
                          <span>{credit.ticketReference}</span>
                          {credit.verified && (
                            <small>
                              <ShieldCheck size={12} />
                              Verified in demo
                            </small>
                          )}
                        </div>
                      </td>

                      <td className="acpn-money">
                        {formatMoney(credit.amount)}
                      </td>

                      <td>
                        <strong className="acpn-balance">
                          {formatMoney(credit.balance)}
                        </strong>
                      </td>

                      <td className="acpn-date">
                        {formatDate(credit.expiresOn)}
                      </td>

                      <td>
                        <span
                          className={`acpn-status acpn-status-${status.toLowerCase()}`}
                        >
                          <span />
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="acpn-row-actions">
                          {status === "Available" && (
                            <button
                              type="button"
                              className="acpn-redeem-btn"
                              onClick={() => redeemDemoCredit(credit)}
                              title="Demo only: mark entire balance as used"
                            >
                              Use demo
                            </button>
                          )}

                          <button
                            type="button"
                            className="acpn-icon-btn acpn-delete-btn"
                            onClick={() => deleteCredit(credit)}
                            aria-label={`Delete credit ${credit.ticketReference}`}
                            title="Delete credit record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredCredits.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      <div className="acpn-empty">
                        <Wallet size={30} />
                        <h3>No wallet credits found</h3>
                        <p>
                          Issue a verified movie-ticket credit or change the
                          search filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="acpn-demo-note">
            <ShieldCheck size={15} />
            All records shown here are browser-only demo data. Real wallet
            balances must be tied to authenticated customers and updated by
            your backend after verified refunds and successful checkout.
          </p>
        </section>
      )}

      {modalType === "coupon" && (
        <div className="acpn-modal-backdrop" onMouseDown={closeModal}>
          <section
            className="acpn-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="acpn-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="acpn-modal-header">
              <div>
                <p className="acpn-eyebrow">PURCHASE OFFER</p>
                <h2 id="acpn-modal-title">
                  {editingId !== null ? "Edit coupon" : "Create coupon"}
                </h2>
              </div>
              <button
                className="acpn-modal-close"
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <form className="acpn-form" onSubmit={submitCoupon}>
              <label className="acpn-field">
                <span>Coupon code *</span>
                <input
                  value={couponForm.code}
                  onChange={(event) =>
                    setCouponForm((previous) => ({
                      ...previous,
                      code: event.target.value
                        .toUpperCase()
                        .replace(/\s+/g, ""),
                    }))
                  }
                  placeholder="Example: ORDER2000"
                  maxLength={25}
                  required
                />
              </label>

              <label className="acpn-field">
                <span>Offer title *</span>
                <input
                  value={couponForm.title}
                  onChange={(event) =>
                    setCouponForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Example: Grocery savings"
                  maxLength={70}
                  required
                />
              </label>

              <label className="acpn-field">
                <span>Description</span>
                <textarea
                  value={couponForm.description}
                  onChange={(event) =>
                    setCouponForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Explain the offer..."
                  rows={2}
                  maxLength={180}
                />
              </label>

              <div className="acpn-form-row">
                <label className="acpn-field">
                  <span>Discount type *</span>
                  <select
                    value={couponForm.type}
                    onChange={(event) =>
                      setCouponForm((previous) => ({
                        ...previous,
                        type: event.target.value,
                        maxDiscount:
                          event.target.value === "fixed"
                            ? "0"
                            : previous.maxDiscount === "0"
                              ? "100"
                              : previous.maxDiscount,
                      }))
                    }
                  >
                    <option value="fixed">Fixed amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </label>

                <label className="acpn-field">
                  <span>
                    Discount value {couponForm.type === "fixed" ? "(₹)" : "(%)"} *
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    max={
                      couponForm.type === "percentage" ? "100" : undefined
                    }
                    step="0.01"
                    value={couponForm.value}
                    onChange={(event) =>
                      setCouponForm((previous) => ({
                        ...previous,
                        value: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="acpn-form-row">
                <label className="acpn-field">
                  <span>Minimum order (₹) *</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={couponForm.minOrder}
                    onChange={(event) =>
                      setCouponForm((previous) => ({
                        ...previous,
                        minOrder: event.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label className="acpn-field">
                  <span>Usage limit *</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={couponForm.usageLimit}
                    onChange={(event) =>
                      setCouponForm((previous) => ({
                        ...previous,
                        usageLimit: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              {couponForm.type === "percentage" && (
                <label className="acpn-field">
                  <span>Maximum discount (₹)</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={couponForm.maxDiscount}
                    onChange={(event) =>
                      setCouponForm((previous) => ({
                        ...previous,
                        maxDiscount: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
              )}

              <div className="acpn-form-row">
                <label className="acpn-field">
                  <span>Expiry date *</span>
                  <input
                    type="date"
                    min={todayString()}
                    value={couponForm.expiresOn}
                    onChange={(event) =>
                      setCouponForm((previous) => ({
                        ...previous,
                        expiresOn: event.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label className="acpn-field">
                  <span>Status</span>
                  <select
                    value={couponForm.status}
                    onChange={(event) =>
                      setCouponForm((previous) => ({
                        ...previous,
                        status: event.target.value,
                      }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
              </div>

              {formError && (
                <p className="acpn-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="acpn-form-actions">
                <button
                  type="button"
                  className="acpn-secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="acpn-primary-btn">
                  {editingId !== null ? "Save changes" : "Create coupon"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {modalType === "credit" && (
        <div className="acpn-modal-backdrop" onMouseDown={closeModal}>
          <section
            className="acpn-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="acpn-credit-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="acpn-modal-header">
              <div>
                <p className="acpn-eyebrow">PARTNER VOUCHER CREDIT</p>
                <h2 id="acpn-credit-title">Issue wallet credit</h2>
              </div>
              <button
                className="acpn-modal-close"
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <div className="acpn-verification-warning">
              <ShieldCheck size={19} />
              <p>
                Issue only after checking the ticket reference and confirming
                that the ticket provider authorizes the credit.
              </p>
            </div>

            <form className="acpn-form" onSubmit={submitCredit}>
              <label className="acpn-field">
                <span>Customer name *</span>
                <input
                  value={creditForm.customerName}
                  onChange={(event) =>
                    setCreditForm((previous) => ({
                      ...previous,
                      customerName: event.target.value,
                    }))
                  }
                  placeholder="Customer's full name"
                  required
                />
              </label>

              <label className="acpn-field">
                <span>Customer email *</span>
                <input
                  type="email"
                  value={creditForm.email}
                  onChange={(event) =>
                    setCreditForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  placeholder="customer@example.com"
                  required
                />
              </label>

              <label className="acpn-field">
                <span>Movie ticket / voucher reference *</span>
                <input
                  value={creditForm.ticketReference}
                  onChange={(event) =>
                    setCreditForm((previous) => ({
                      ...previous,
                      ticketReference: event.target.value,
                    }))
                  }
                  placeholder="Enter the booking reference"
                  required
                />
              </label>

              <div className="acpn-form-row">
                <label className="acpn-field">
                  <span>Credit amount (₹) *</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={creditForm.amount}
                    onChange={(event) =>
                      setCreditForm((previous) => ({
                        ...previous,
                        amount: event.target.value,
                      }))
                    }
                    required
                  />
                </label>

                <label className="acpn-field">
                  <span>Credit expiry *</span>
                  <input
                    type="date"
                    min={todayString()}
                    value={creditForm.expiresOn}
                    onChange={(event) =>
                      setCreditForm((previous) => ({
                        ...previous,
                        expiresOn: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              <label className="acpn-field">
                <span>Ticket-provider eligibility *</span>
                <select
                  value={creditForm.verification}
                  onChange={(event) =>
                    setCreditForm((previous) => ({
                      ...previous,
                      verification: event.target.value,
                    }))
                  }
                >
                  <option value="no">Not verified</option>
                  <option value="yes">
                    Verified: credit is authorized
                  </option>
                </select>
              </label>

              {formError && (
                <p className="acpn-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="acpn-form-actions">
                <button
                  type="button"
                  className="acpn-secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="acpn-primary-btn">
                  <Wallet size={16} />
                  Issue demo credit
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
