
import React, { useMemo, useState } from "react";
import {
  Search,
  Store,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  X,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  RefreshCw,
  ClipboardCheck,
} from "lucide-react";
import "./Admin_ShopApprovals.css";

const STORAGE_KEY = "nearshopAdminShopApplications";

const demoApplications = [
  {
    id: "NS-APP-1001",
    shopName: "Green Mart",
    owner: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 98765 43210",
    category: "Organic Groceries",
    address: "Anna Nagar, Chennai",
    appliedOn: "2026-10-20",
    status: "Pending",
    description:
      "Fresh vegetables, fruits, grains and organic grocery products.",
  },
  {
    id: "NS-APP-1002",
    shopName: "Daily Fresh",
    owner: "Anita Rao",
    email: "anita@example.com",
    phone: "+91 98765 43211",
    category: "Vegetables & Fruits",
    address: "Velachery, Chennai",
    appliedOn: "2026-10-19",
    status: "Pending",
    description:
      "Locally sourced fruits and vegetables for daily shopping.",
  },
  {
    id: "NS-APP-1003",
    shopName: "Nature Basket",
    owner: "Suresh Kumar",
    email: "suresh@example.com",
    phone: "+91 98765 43212",
    category: "Organic Groceries",
    address: "Adyar, Chennai",
    appliedOn: "2026-10-18",
    status: "Pending",
    description:
      "Organic staples, grains and farm-fresh vegetables.",
  },
  {
    id: "NS-APP-1004",
    shopName: "Farm to Home",
    owner: "Kavya Nair",
    email: "kavya@example.com",
    phone: "+91 98765 43213",
    category: "Farm Produce",
    address: "Tambaram, Chennai",
    appliedOn: "2026-10-17",
    status: "Approved",
    description:
      "Seasonal farm produce supplied by nearby farms.",
  },
  {
    id: "NS-APP-1005",
    shopName: "Daily Needs Store",
    owner: "Manoj Kumar",
    email: "manoj@example.com",
    phone: "+91 98765 43214",
    category: "Grocery & Staples",
    address: "Guindy, Chennai",
    appliedOn: "2026-10-16",
    status: "Rejected",
    description:
      "Everyday grocery products and household essentials.",
  },
];

function readApplications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Could not load applications:", error);
  }

  return demoApplications;
}

function formatDate(dateValue) {
  if (!dateValue) return "—";

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Admin_ShopApprovals() {
  const [applications, setApplications] = useState(readApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [notice, setNotice] = useState("");

  const counts = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((item) => item.status === "Pending").length,
    approved: applications.filter((item) => item.status === "Approved").length,
    rejected: applications.filter((item) => item.status === "Rejected").length,
  }), [applications]);

  const filteredApplications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        activeFilter === "All" || application.status === activeFilter;

      const searchable = [
        application.id,
        application.shopName,
        application.owner,
        application.email,
        application.category,
        application.address,
      ].join(" ").toLowerCase();

      return matchesStatus && searchable.includes(query);
    });
  }, [applications, activeFilter, searchTerm]);

  const saveApplications = (updatedApplications) => {
    setApplications(updatedApplications);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedApplications)
      );
    } catch (error) {
      console.error("Could not save applications:", error);
      setNotice("Unable to save changes to browser storage.");
    }
  };

  const updateStatus = (application, nextStatus) => {
    const confirmed = window.confirm(
      `${nextStatus} the application for "${application.shopName}"?`
    );

    if (!confirmed) return;

    const updated = applications.map((item) =>
      item.id === application.id
        ? {
            ...item,
            status: nextStatus,
            reviewedAt: new Date().toISOString(),
          }
        : item
    );

    saveApplications(updated);
    setSelectedApplication(null);
    setNotice(
      `${application.shopName} marked as ${nextStatus.toLowerCase()}.`
    );
  };

  const resetDemoData = () => {
    const confirmed = window.confirm(
      "Restore the original sample applications? Your demo changes will be replaced."
    );

    if (!confirmed) return;

    saveApplications(demoApplications);
    setSearchTerm("");
    setActiveFilter("All");
    setNotice("Sample applications have been restored.");
  };

  return (
    <section className="ns-approvals-page">
      <div className="nsa-heading">
        <div>
          <span className="nsa-eyebrow">SELLER MANAGEMENT</span>
          <h2>Shop Approvals</h2>
          <p>
            Review local grocery store applications before they join
            the NearShop marketplace.
          </p>
        </div>

        <button
          type="button"
          className="nsa-reset-button"
          onClick={resetDemoData}
        >
          <RefreshCw size={15} />
          Reset Demo Data
        </button>
      </div>

      {notice && (
        <div className="nsa-notice" role="status">
          <CheckCircle2 size={17} />
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Application statistics */}
      <div className="nsa-stats">
        <article className="nsa-stat-card">
          <span className="nsa-stat-icon total">
            <Store size={21} />
          </span>
          <div>
            <p>Total Applications</p>
            <h3>{counts.total}</h3>
            <small>All shop applications</small>
          </div>
        </article>

        <article className="nsa-stat-card">
          <span className="nsa-stat-icon pending">
            <Clock3 size={21} />
          </span>
          <div>
            <p>Pending Review</p>
            <h3>{counts.pending}</h3>
            <small>Awaiting a decision</small>
          </div>
        </article>

        <article className="nsa-stat-card">
          <span className="nsa-stat-icon approved">
            <CheckCircle2 size={21} />
          </span>
          <div>
            <p>Approved Shops</p>
            <h3>{counts.approved}</h3>
            <small>Accepted applications</small>
          </div>
        </article>

        <article className="nsa-stat-card">
          <span className="nsa-stat-icon rejected">
            <XCircle size={21} />
          </span>
          <div>
            <p>Rejected</p>
            <h3>{counts.rejected}</h3>
            <small>Declined applications</small>
          </div>
        </article>
      </div>

      {/* Applications table */}
      <div className="nsa-panel">
        <div className="nsa-panel-heading">
          <div>
            <h3>Seller Applications</h3>
            <p>Review shop details before approving an application.</p>
          </div>

          <span className="nsa-results-count">
            {filteredApplications.length} results
          </span>
        </div>

        <div className="nsa-toolbar">
          <label className="nsa-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search store, owner, email or ID..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search seller applications"
            />
          </label>

          <div className="nsa-filter-tabs" aria-label="Application status">
            {["All", "Pending", "Approved", "Rejected"].map((filter) => (
              <button
                type="button"
                key={filter}
                className={activeFilter === filter ? "active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
                {filter === "Pending" && (
                  <span>{counts.pending}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="nsa-table-scroll">
          <table className="nsa-table">
            <thead>
              <tr>
                <th>SHOP / APPLICATION</th>
                <th>OWNER DETAILS</th>
                <th>CATEGORY</th>
                <th>APPLIED ON</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <div className="nsa-shop-cell">
                      <span className="nsa-shop-icon">
                        <Store size={19} />
                      </span>
                      <div>
                        <strong>{application.shopName}</strong>
                        <small>{application.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="nsa-owner-cell">
                      <strong>{application.owner}</strong>
                      <small>{application.email}</small>
                    </div>
                  </td>

                  <td>{application.category}</td>
                  <td>{formatDate(application.appliedOn)}</td>

                  <td>
                    <span className={`nsa-status ${application.status.toLowerCase()}`}>
                      <span />
                      {application.status}
                    </span>
                  </td>

                  <td>
                    <div className="nsa-actions">
                      <button
                        type="button"
                        className="nsa-view-button"
                        onClick={() => setSelectedApplication(application)}
                        aria-label={`View ${application.shopName}`}
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>

                      {application.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            className="nsa-approve-button"
                            onClick={() => updateStatus(application, "Approved")}
                            aria-label={`Approve ${application.shopName}`}
                            title="Approve"
                          >
                            <Check size={15} />
                          </button>

                          <button
                            type="button"
                            className="nsa-reject-button"
                            onClick={() => updateStatus(application, "Rejected")}
                            aria-label={`Reject ${application.shopName}`}
                            title="Reject"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan={6} className="nsa-empty">
                    <ClipboardCheck size={29} />
                    <strong>No applications found</strong>
                    <span>Try another search term or status filter.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="nsa-table-footer">
          Showing {filteredApplications.length} of {applications.length} applications
        </div>
      </div>

      {/* Details popup */}
      {selectedApplication && (
        <div
          className="nsa-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedApplication(null);
            }
          }}
        >
          <section
            className="nsa-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nsa-modal-title"
          >
            <div className="nsa-modal-heading">
              <div>
                <span>APPLICATION DETAILS</span>
                <h3 id="nsa-modal-title">
                  {selectedApplication.shopName}
                </h3>
                <p>{selectedApplication.id}</p>
              </div>

              <button
                type="button"
                aria-label="Close details"
                onClick={() => setSelectedApplication(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="nsa-modal-status-row">
              <span>Application status</span>
              <span className={`nsa-status ${selectedApplication.status.toLowerCase()}`}>
                <span />
                {selectedApplication.status}
              </span>
            </div>

            <div className="nsa-detail-grid">
              <div>
                <span><Store size={15} /> Store owner</span>
                <strong>{selectedApplication.owner}</strong>
              </div>

              <div>
                <span><Mail size={15} /> Email address</span>
                <strong>{selectedApplication.email}</strong>
              </div>

              <div>
                <span><Phone size={15} /> Phone number</span>
                <strong>{selectedApplication.phone}</strong>
              </div>

              <div>
                <span><MapPin size={15} /> Store address</span>
                <strong>{selectedApplication.address}</strong>
              </div>

              <div>
                <span><CalendarDays size={15} /> Applied on</span>
                <strong>{formatDate(selectedApplication.appliedOn)}</strong>
              </div>

              <div>
                <span><ClipboardCheck size={15} /> Category</span>
                <strong>{selectedApplication.category}</strong>
              </div>
            </div>

            <div className="nsa-description">
              <strong>Store description</strong>
              <p>{selectedApplication.description}</p>
            </div>

            {selectedApplication.status === "Pending" && (
              <div className="nsa-modal-actions">
                <button
                  type="button"
                  className="nsa-modal-reject"
                  onClick={() => updateStatus(selectedApplication, "Rejected")}
                >
                  <X size={15} />
                  Reject Application
                </button>

                <button
                  type="button"
                  className="nsa-modal-approve"
                  onClick={() => updateStatus(selectedApplication, "Approved")}
                >
                  <Check size={15} />
                  Approve Shop
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      <p className="nsa-demo-note">
        Demo mode: these are sample applications saved in this browser.
        They are not yet synchronized with Seller registration or MongoDB.
      </p>
    </section>
  );
}

export default Admin_ShopApprovals;
