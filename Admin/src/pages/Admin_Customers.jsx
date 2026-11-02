
import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserRound,
  Search,
  CircleCheck,
  Ban,
  Eye,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShoppingCart,
  Wallet,
  X,
  UserCheck,
  Filter,
} from "lucide-react";
import "./Admin_Customers.css";

const STORAGE_KEY = "nearshopAdminCustomers";

const initialCustomers = [
  {
    id: "NS-CU-1001",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    location: "Anna Nagar, Chennai",
    joined: "2026-06-12",
    orders: 18,
    spent: 12450,
    status: "Active",
    initials: "PS",
    color: "rose",
  },
  {
    id: "NS-CU-1002",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    phone: "+91 98765 43211",
    location: "Velachery, Chennai",
    joined: "2026-07-05",
    orders: 12,
    spent: 8900,
    status: "Active",
    initials: "RM",
    color: "blue",
  },
  {
    id: "NS-CU-1003",
    name: "Sneha Iyer",
    email: "sneha@example.com",
    phone: "+91 98765 43212",
    location: "Adyar, Chennai",
    joined: "2026-08-19",
    orders: 7,
    spent: 4260,
    status: "Active",
    initials: "SI",
    color: "purple",
  },
  {
    id: "NS-CU-1004",
    name: "Arjun Kumar",
    email: "arjun@example.com",
    phone: "+91 98765 43213",
    location: "Tambaram, Chennai",
    joined: "2026-05-22",
    orders: 25,
    spent: 18750,
    status: "Active",
    initials: "AK",
    color: "green",
  },
  {
    id: "NS-CU-1005",
    name: "Neha Jain",
    email: "neha@example.com",
    phone: "+91 98765 43214",
    location: "Guindy, Chennai",
    joined: "2026-09-14",
    orders: 2,
    spent: 950,
    status: "Blocked",
    initials: "NJ",
    color: "orange",
  },
  {
    id: "NS-CU-1006",
    name: "Karthik Raj",
    email: "karthik@example.com",
    phone: "+91 98765 43215",
    location: "T. Nagar, Chennai",
    joined: "2026-10-02",
    orders: 4,
    spent: 2150,
    status: "Active",
    initials: "KR",
    color: "teal",
  },
];

function loadCustomers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load customers:", error);
  }

  return initialCustomers;
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
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

function Admin_Customers() {
  const [customers, setCustomers] = useState(loadCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (error) {
      console.error("Unable to save customers:", error);
      setNotice("Could not save changes in browser storage.");
    }
  }, [customers]);

  const counts = useMemo(() => {
    const totalSpent = customers.reduce(
      (sum, customer) => sum + Number(customer.spent || 0),
      0
    );

    return {
      total: customers.length,
      active: customers.filter((customer) => customer.status === "Active").length,
      blocked: customers.filter((customer) => customer.status === "Blocked").length,
      orders: customers.reduce(
        (sum, customer) => sum + Number(customer.orders || 0),
        0
      ),
      totalSpent,
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      const searchableText = [
        customer.id,
        customer.name,
        customer.email,
        customer.phone,
        customer.location,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [customers, search, statusFilter]);

  const toggleCustomerStatus = (customer) => {
    const nextStatus =
      customer.status === "Active" ? "Blocked" : "Active";

    const confirmed = window.confirm(
      `${nextStatus === "Blocked" ? "Block" : "Reactivate"} ${customer.name}?`
    );

    if (!confirmed) return;

    setCustomers((current) =>
      current.map((item) =>
        item.id === customer.id
          ? { ...item, status: nextStatus }
          : item
      )
    );

    setSelectedCustomer(null);
    setNotice(`${customer.name} is now ${nextStatus.toLowerCase()}.`);
  };

  return (
    <section className="nsc-page">
      <div className="nsc-heading">
        <div>
          <span className="nsc-eyebrow">MARKETPLACE MANAGEMENT</span>
          <h2>Customers</h2>
          <p>View customer accounts and monitor shopping activity.</p>
        </div>
      </div>

      {notice && (
        <div className="nsc-notice" role="status">
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

      {/* Customer statistics */}
      <div className="nsc-stats">
        <article className="nsc-stat-card">
          <span className="nsc-stat-icon total">
            <Users size={21} />
          </span>
          <div>
            <p>Total Customers</p>
            <h3>{counts.total.toLocaleString("en-IN")}</h3>
            <small>Customer records</small>
          </div>
        </article>

        <article className="nsc-stat-card">
          <span className="nsc-stat-icon active">
            <UserCheck size={21} />
          </span>
          <div>
            <p>Active Customers</p>
            <h3>{counts.active.toLocaleString("en-IN")}</h3>
            <small>Accounts enabled</small>
          </div>
        </article>

        <article className="nsc-stat-card">
          <span className="nsc-stat-icon orders">
            <ShoppingCart size={21} />
          </span>
          <div>
            <p>Total Orders</p>
            <h3>{counts.orders.toLocaleString("en-IN")}</h3>
            <small>Across listed customers</small>
          </div>
        </article>

        <article className="nsc-stat-card">
          <span className="nsc-stat-icon blocked">
            <Ban size={21} />
          </span>
          <div>
            <p>Blocked Accounts</p>
            <h3>{counts.blocked.toLocaleString("en-IN")}</h3>
            <small>Currently blocked</small>
          </div>
        </article>
      </div>

      {/* Customer directory */}
      <div className="nsc-panel">
        <div className="nsc-panel-heading">
          <div>
            <h3>Customer Directory</h3>
            <p>Search customer details and manage account status.</p>
          </div>

          <span className="nsc-count">
            {filteredCustomers.length} customers
          </span>
        </div>

        <div className="nsc-toolbar">
          <label className="nsc-search">
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone or customer ID..."
              aria-label="Search customers"
            />
          </label>

          <label className="nsc-filter">
            <Filter size={15} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter customer status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </label>
        </div>

        <div className="nsc-table-scroll">
          <table className="nsc-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>CONTACT DETAILS</th>
                <th>ORDERS</th>
                <th>TOTAL SPENT</th>
                <th>JOINED</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="nsc-customer-cell">
                      <span className={`nsc-avatar ${customer.color}`}>
                        {customer.initials}
                      </span>

                      <div>
                        <strong>{customer.name}</strong>
                        <small>{customer.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="nsc-contact-cell">
                      <span>{customer.email}</span>
                      <small>{customer.phone}</small>
                    </div>
                  </td>

                  <td>{customer.orders}</td>
                  <td className="nsc-money">{formatCurrency(customer.spent)}</td>
                  <td>{formatDate(customer.joined)}</td>

                  <td>
                    <span className={`nsc-status ${customer.status.toLowerCase()}`}>
                      <span />
                      {customer.status}
                    </span>
                  </td>

                  <td>
                    <div className="nsc-actions">
                      <button
                        type="button"
                        className="nsc-view-button"
                        onClick={() => setSelectedCustomer(customer)}
                        aria-label={`View ${customer.name}`}
                        title="View customer"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        className={
                          customer.status === "Active"
                            ? "nsc-block-button"
                            : "nsc-activate-button"
                        }
                        onClick={() => toggleCustomerStatus(customer)}
                        aria-label={
                          customer.status === "Active"
                            ? `Block ${customer.name}`
                            : `Reactivate ${customer.name}`
                        }
                        title={
                          customer.status === "Active"
                            ? "Block customer"
                            : "Reactivate customer"
                        }
                      >
                        {customer.status === "Active" ? (
                          <Ban size={15} />
                        ) : (
                          <UserCheck size={15} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="nsc-empty">
                    <Users size={28} />
                    <strong>No customers found</strong>
                    <span>Change your search or filter and try again.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="nsc-table-footer">
          Showing {filteredCustomers.length} of {customers.length} customers
          <span>
            Sample customer spending: {formatCurrency(counts.totalSpent)}
          </span>
        </div>
      </div>

      {/* Customer details popup */}
      {selectedCustomer && (
        <div
          className="nsc-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCustomer(null);
            }
          }}
        >
          <section
            className="nsc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nsc-modal-title"
          >
            <div className="nsc-modal-heading">
              <span className={`nsc-modal-avatar ${selectedCustomer.color}`}>
                {selectedCustomer.initials}
              </span>

              <div>
                <h3 id="nsc-modal-title">{selectedCustomer.name}</h3>
                <p>{selectedCustomer.id}</p>
              </div>

              <button
                type="button"
                aria-label="Close customer details"
                onClick={() => setSelectedCustomer(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="nsc-modal-status">
              <span>Account status</span>
              <span className={`nsc-status ${selectedCustomer.status.toLowerCase()}`}>
                <span />
                {selectedCustomer.status}
              </span>
            </div>

            <div className="nsc-detail-list">
              <div>
                <Mail size={17} />
                <span>
                  <small>Email address</small>
                  <strong>{selectedCustomer.email}</strong>
                </span>
              </div>

              <div>
                <Phone size={17} />
                <span>
                  <small>Phone number</small>
                  <strong>{selectedCustomer.phone}</strong>
                </span>
              </div>

              <div>
                <MapPin size={17} />
                <span>
                  <small>Location</small>
                  <strong>{selectedCustomer.location}</strong>
                </span>
              </div>

              <div>
                <CalendarDays size={17} />
                <span>
                  <small>Joined on</small>
                  <strong>{formatDate(selectedCustomer.joined)}</strong>
                </span>
              </div>
            </div>

            <div className="nsc-modal-metrics">
              <div>
                <ShoppingCart size={18} />
                <small>Total orders</small>
                <strong>{selectedCustomer.orders}</strong>
              </div>

              <div>
                <Wallet size={18} />
                <small>Total spending</small>
                <strong>{formatCurrency(selectedCustomer.spent)}</strong>
              </div>
            </div>

            <button
              type="button"
              className={
                selectedCustomer.status === "Active"
                  ? "nsc-modal-block"
                  : "nsc-modal-activate"
              }
              onClick={() => toggleCustomerStatus(selectedCustomer)}
            >
              {selectedCustomer.status === "Active" ? (
                <>
                  <Ban size={16} /> Block Customer
                </>
              ) : (
                <>
                  <UserCheck size={16} /> Reactivate Customer
                </>
              )}
            </button>
          </section>
        </div>
      )}

      <p className="nsc-demo-note">
        Demo mode: these customer records are sample data saved in this
        browser. Blocking an account will not affect the live Customer app
        until the shared backend is connected.
      </p>
    </section>
  );
}

export default Admin_Customers;
