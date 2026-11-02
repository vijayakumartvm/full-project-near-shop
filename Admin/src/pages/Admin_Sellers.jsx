
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store,
  Search,
  Users,
  CircleCheck,
  Clock3,
  Eye,
  PauseCircle,
  PlayCircle,
  ArrowRight,
  X,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Package,
  ShoppingCart,
  Filter,
} from "lucide-react";
import "./Admin_Sellers.css";

const STORAGE_KEY = "nearshopAdminSellerList";

const initialSellers = [
  {
    id: "NS-SL-1001",
    storeName: "Green Mart",
    owner: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 98765 43210",
    location: "Anna Nagar, Chennai",
    category: "Organic Groceries",
    products: 124,
    orders: 348,
    joined: "2026-06-10",
    status: "Active",
  },
  {
    id: "NS-SL-1002",
    storeName: "Daily Fresh",
    owner: "Anita Rao",
    email: "anita@example.com",
    phone: "+91 98765 43211",
    location: "Velachery, Chennai",
    category: "Vegetables & Fruits",
    products: 86,
    orders: 219,
    joined: "2026-07-15",
    status: "Active",
  },
  {
    id: "NS-SL-1003",
    storeName: "Nature Basket",
    owner: "Suresh Kumar",
    email: "suresh@example.com",
    phone: "+91 98765 43212",
    location: "Adyar, Chennai",
    category: "Organic Groceries",
    products: 62,
    orders: 94,
    joined: "2026-08-21",
    status: "Pending",
  },
  {
    id: "NS-SL-1004",
    storeName: "Farm to Home",
    owner: "Kavya Nair",
    email: "kavya@example.com",
    phone: "+91 98765 43213",
    location: "Tambaram, Chennai",
    category: "Farm Produce",
    products: 103,
    orders: 287,
    joined: "2026-05-30",
    status: "Active",
  },
  {
    id: "NS-SL-1005",
    storeName: "Daily Needs Store",
    owner: "Manoj Kumar",
    email: "manoj@example.com",
    phone: "+91 98765 43214",
    location: "Guindy, Chennai",
    category: "Grocery & Staples",
    products: 0,
    orders: 0,
    joined: "2026-10-16",
    status: "Paused",
  },
  {
    id: "NS-SL-1006",
    storeName: "Fresh Valley",
    owner: "Meena Lakshmi",
    email: "meena@example.com",
    phone: "+91 98765 43215",
    location: "T. Nagar, Chennai",
    category: "Fresh Produce",
    products: 74,
    orders: 163,
    joined: "2026-09-03",
    status: "Active",
  },
];

function loadSellers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const data = JSON.parse(saved);
      if (Array.isArray(data)) return data;
    }
  } catch (error) {
    console.error("Unable to load sellers:", error);
  }

  return initialSellers;
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

function Admin_Sellers() {
  const navigate = useNavigate();

  const [sellers, setSellers] = useState(loadSellers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sellers));
    } catch (error) {
      console.error("Unable to save sellers:", error);
      setNotice("Could not save changes in browser storage.");
    }
  }, [sellers]);

  const counts = useMemo(
    () => ({
      total: sellers.length,
      active: sellers.filter((seller) => seller.status === "Active").length,
      pending: sellers.filter((seller) => seller.status === "Pending").length,
      paused: sellers.filter((seller) => seller.status === "Paused").length,
    }),
    [sellers]
  );

  const filteredSellers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sellers.filter((seller) => {
      const matchesStatus =
        statusFilter === "All" || seller.status === statusFilter;

      const searchableText = [
        seller.id,
        seller.storeName,
        seller.owner,
        seller.email,
        seller.location,
        seller.category,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [sellers, search, statusFilter]);

  const changeStatus = (seller) => {
    if (seller.status === "Pending") {
      setNotice("Review pending applications from the Shop Approvals page.");
      return;
    }

    const nextStatus = seller.status === "Active" ? "Paused" : "Active";

    const confirmed = window.confirm(
      `${nextStatus === "Paused" ? "Pause" : "Activate"} ${seller.storeName}?`
    );

    if (!confirmed) return;

    setSellers((current) =>
      current.map((item) =>
        item.id === seller.id ? { ...item, status: nextStatus } : item
      )
    );

    setSelectedSeller(null);
    setNotice(`${seller.storeName} is now ${nextStatus.toLowerCase()}.`);
  };

  const statusClass = (status) =>
    `nsl-status ${status.toLowerCase()}`;

  return (
    <section className="nsl-page">
      <div className="nsl-heading">
        <div>
          <span className="nsl-eyebrow">MARKETPLACE MANAGEMENT</span>
          <h2>Sellers</h2>
          <p>Manage grocery stores and monitor marketplace seller activity.</p>
        </div>

        <button
          type="button"
          className="nsl-approval-link"
          onClick={() => navigate("/admin/shop-approvals")}
        >
          <Clock3 size={16} />
          Shop Approvals
          <ArrowRight size={15} />
        </button>
      </div>

      {notice && (
        <div className="nsl-notice" role="status">
          <CircleCheck size={17} />
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Seller statistics */}
      <div className="nsl-stats">
        <article className="nsl-stat-card">
          <span className="nsl-stat-icon total">
            <Store size={21} />
          </span>
          <div>
            <p>Total Sellers</p>
            <h3>{counts.total}</h3>
            <small>All registered seller records</small>
          </div>
        </article>

        <article className="nsl-stat-card">
          <span className="nsl-stat-icon active">
            <CircleCheck size={21} />
          </span>
          <div>
            <p>Active Sellers</p>
            <h3>{counts.active}</h3>
            <small>Active demo accounts</small>
          </div>
        </article>

        <article className="nsl-stat-card">
          <span className="nsl-stat-icon pending">
            <Clock3 size={21} />
          </span>
          <div>
            <p>Pending Approval</p>
            <h3>{counts.pending}</h3>
            <small>Awaiting admin review</small>
          </div>
        </article>

        <article className="nsl-stat-card">
          <span className="nsl-stat-icon paused">
            <Users size={21} />
          </span>
          <div>
            <p>Paused Sellers</p>
            <h3>{counts.paused}</h3>
            <small>Currently inactive</small>
          </div>
        </article>
      </div>

      {/* Seller directory */}
      <div className="nsl-panel">
        <div className="nsl-panel-heading">
          <div>
            <h3>Seller Directory</h3>
            <p>Search, review and manage registered sellers.</p>
          </div>
          <span className="nsl-count">{filteredSellers.length} sellers</span>
        </div>

        <div className="nsl-toolbar">
          <label className="nsl-search">
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search store, owner, email or location..."
              aria-label="Search sellers"
            />
          </label>

          <label className="nsl-filter">
            <Filter size={15} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter seller status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Paused">Paused</option>
            </select>
          </label>
        </div>

        <div className="nsl-table-scroll">
          <table className="nsl-table">
            <thead>
              <tr>
                <th>STORE</th>
                <th>OWNER</th>
                <th>CATEGORY</th>
                <th>PRODUCTS</th>
                <th>ORDERS</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredSellers.map((seller) => (
                <tr key={seller.id}>
                  <td>
                    <div className="nsl-store-cell">
                      <span className="nsl-store-avatar">
                        <Store size={18} />
                      </span>
                      <div>
                        <strong>{seller.storeName}</strong>
                        <small>{seller.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="nsl-owner-cell">
                      <strong>{seller.owner}</strong>
                      <small>{seller.email}</small>
                    </div>
                  </td>

                  <td>{seller.category}</td>
                  <td>{seller.products}</td>
                  <td>{seller.orders}</td>

                  <td>
                    <span className={statusClass(seller.status)}>
                      <span />
                      {seller.status}
                    </span>
                  </td>

                  <td>
                    <div className="nsl-actions">
                      <button
                        type="button"
                        className="nsl-view-button"
                        onClick={() => setSelectedSeller(seller)}
                        title="View seller details"
                        aria-label={`View ${seller.storeName}`}
                      >
                        <Eye size={15} />
                      </button>

                      {seller.status !== "Pending" && (
                        <button
                          type="button"
                          className={
                            seller.status === "Active"
                              ? "nsl-pause-button"
                              : "nsl-activate-button"
                          }
                          onClick={() => changeStatus(seller)}
                          title={
                            seller.status === "Active"
                              ? "Pause seller"
                              : "Activate seller"
                          }
                          aria-label={
                            seller.status === "Active"
                              ? "Pause seller"
                              : "Activate seller"
                          }
                        >
                          {seller.status === "Active" ? (
                            <PauseCircle size={15} />
                          ) : (
                            <PlayCircle size={15} />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSellers.length === 0 && (
                <tr>
                  <td colSpan={7} className="nsl-empty">
                    <Store size={28} />
                    <strong>No sellers found</strong>
                    <span>Change your search or filter and try again.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="nsl-table-footer">
          Showing {filteredSellers.length} of {sellers.length} sellers
        </div>
      </div>

      {/* Seller details modal */}
      {selectedSeller && (
        <div
          className="nsl-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedSeller(null);
            }
          }}
        >
          <section
            className="nsl-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nsl-modal-title"
          >
            <div className="nsl-modal-heading">
              <span className="nsl-modal-store-icon">
                <Store size={24} />
              </span>

              <div>
                <h3 id="nsl-modal-title">{selectedSeller.storeName}</h3>
                <p>{selectedSeller.id}</p>
              </div>

              <button
                type="button"
                aria-label="Close seller details"
                onClick={() => setSelectedSeller(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="nsl-modal-status">
              <span>Account status</span>
              <span className={statusClass(selectedSeller.status)}>
                <span />
                {selectedSeller.status}
              </span>
            </div>

            <div className="nsl-detail-list">
              <div>
                <Mail size={17} />
                <span>
                  <small>Email address</small>
                  <strong>{selectedSeller.email}</strong>
                </span>
              </div>

              <div>
                <Phone size={17} />
                <span>
                  <small>Phone number</small>
                  <strong>{selectedSeller.phone}</strong>
                </span>
              </div>

              <div>
                <MapPin size={17} />
                <span>
                  <small>Store location</small>
                  <strong>{selectedSeller.location}</strong>
                </span>
              </div>

              <div>
                <Store size={17} />
                <span>
                  <small>Category</small>
                  <strong>{selectedSeller.category}</strong>
                </span>
              </div>
            </div>

            <div className="nsl-modal-metrics">
              <div>
                <Package size={18} />
                <small>Products</small>
                <strong>{selectedSeller.products}</strong>
              </div>

              <div>
                <ShoppingCart size={18} />
                <small>Orders</small>
                <strong>{selectedSeller.orders}</strong>
              </div>

              <div>
                <CalendarDays size={18} />
                <small>Joined</small>
                <strong>{formatDate(selectedSeller.joined)}</strong>
              </div>
            </div>

            {selectedSeller.status === "Pending" ? (
              <button
                type="button"
                className="nsl-modal-primary"
                onClick={() => {
                  setSelectedSeller(null);
                  navigate("/admin/shop-approvals");
                }}
              >
                Review Application <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                className="nsl-modal-primary"
                onClick={() => changeStatus(selectedSeller)}
              >
                {selectedSeller.status === "Active"
                  ? "Pause Seller Account"
                  : "Activate Seller Account"}
              </button>
            )}
          </section>
        </div>
      )}

      <p className="nsl-demo-note">
        Demo mode: seller records are sample data stored in this browser.
        Seller status changes will not affect the live Seller website until
        we connect this page to your shared backend.
      </p>
    </section>
  );
}

export default Admin_Sellers;
