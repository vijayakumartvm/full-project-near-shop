
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  MessageCircle,
  Headphones,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  Send,
  UserRound,
  CalendarDays,
  RefreshCw,
  Trash2,
} from "lucide-react";
import "./Admin_Support.css";

const STORAGE_KEY = "nearshopAdminSupportTickets";

const defaultTickets = [
  {
    id: 1001,
    subject: "Order delivered with missing items",
    customer: "Arun Kumar",
    email: "arun@example.com",
    role: "Customer",
    category: "Order Issue",
    priority: "High",
    status: "Open",
    orderId: "NS-ORD-5001",
    createdAt: "2026-10-22T09:20:00",
    description:
      "My grocery order was delivered, but two items were missing from the package. Please check the order and help me resolve this.",
    replies: [],
  },
  {
    id: 1002,
    subject: "Payment completed but order not confirmed",
    customer: "Priya Devi",
    email: "priya@example.com",
    role: "Customer",
    category: "Payment",
    priority: "Urgent",
    status: "In Progress",
    orderId: "NS-ORD-5002",
    createdAt: "2026-10-22T08:15:00",
    description:
      "My UPI payment was successful, but the order page still shows pending. Please verify the payment status.",
    replies: [
      {
        id: 1,
        sender: "Admin",
        message: "We are checking the transaction details.",
        date: "2026-10-22T08:45:00",
      },
    ],
  },
  {
    id: 1003,
    subject: "Unable to update product inventory",
    customer: "Fresh Farm Store",
    email: "seller@example.com",
    role: "Seller",
    category: "Seller Account",
    priority: "Medium",
    status: "Open",
    orderId: "—",
    createdAt: "2026-10-21T16:40:00",
    description:
      "The inventory page is not saving the quantity after I update product stock. Please help me check this issue.",
    replies: [],
  },
  {
    id: 1004,
    subject: "Request for cancellation and refund",
    customer: "Meena Lakshmi",
    email: "meena@example.com",
    role: "Customer",
    category: "Refund",
    priority: "High",
    status: "In Progress",
    orderId: "NS-ORD-5004",
    createdAt: "2026-10-21T12:30:00",
    description:
      "I would like to cancel my order. Please review the cancellation and refund eligibility.",
    replies: [],
  },
  {
    id: 1005,
    subject: "How do I change my shop details?",
    customer: "Green Basket",
    email: "greenbasket@example.com",
    role: "Seller",
    category: "Seller Account",
    priority: "Low",
    status: "Resolved",
    orderId: "—",
    createdAt: "2026-10-20T10:10:00",
    description:
      "I need to change the phone number and address shown on my seller store profile.",
    replies: [
      {
        id: 2,
        sender: "Admin",
        message: "Open Seller Settings, edit your store details, and save your changes.",
        date: "2026-10-20T11:00:00",
      },
    ],
  },
  {
    id: 1006,
    subject: "Coupon code not applying",
    customer: "Karthik Raj",
    email: "karthik@example.com",
    role: "Customer",
    category: "Coupons",
    priority: "Medium",
    status: "Open",
    orderId: "NS-ORD-5006",
    createdAt: "2026-10-19T15:50:00",
    description:
      "The coupon code is visible on my account, but checkout says that it is not valid. Please review the offer rules.",
    replies: [],
  },
];

const emptyTicket = {
  subject: "",
  customer: "",
  email: "",
  role: "Customer",
  category: "General",
  priority: "Medium",
  status: "Open",
  orderId: "",
  description: "",
};

const statusOptions = ["Open", "In Progress", "Resolved"];
const priorityOptions = ["Low", "Medium", "High", "Urgent"];
const categoryOptions = [
  "General",
  "Order Issue",
  "Payment",
  "Refund",
  "Coupons",
  "Seller Account",
  "Product Issue",
  "Technical Issue",
];

function loadTickets() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultTickets;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : defaultTickets;
  } catch (error) {
    console.error("Unable to load support tickets:", error);
    return defaultTickets;
  }
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function priorityClass(priority) {
  return priority.toLowerCase();
}

export default function Admin_Support() {
  const [tickets, setTickets] = useState(loadTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState(emptyTicket);
  const [replyText, setReplyText] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) || null;

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        String(ticket.id).includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.customer.toLowerCase().includes(query) ||
        ticket.email.toLowerCase().includes(query) ||
        (ticket.orderId || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || ticket.priority === priorityFilter;

      const matchesRole = roleFilter === "All" || ticket.role === roleFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesRole
      );
    });
  }, [tickets, search, statusFilter, priorityFilter, roleFilter]);

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const urgentCount = tickets.filter(
    (ticket) =>
      ticket.priority === "Urgent" && ticket.status !== "Resolved"
  ).length;

  function notify(message) {
    setNotice(message);
  }

  function updateTicket(ticketId, changes) {
    setTickets((previous) =>
      previous.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ...changes } : ticket
      )
    );
  }

  function handleCreateTicket(event) {
    event.preventDefault();

    const subject = newTicket.subject.trim();
    const customer = newTicket.customer.trim();
    const email = newTicket.email.trim().toLowerCase();
    const description = newTicket.description.trim();

    if (!subject || !customer || !email || !description) {
      setFormError("Complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter a valid email address.");
      return;
    }

    const ticket = {
      id: Math.max(1000, ...tickets.map((item) => Number(item.id) || 0)) + 1,
      ...newTicket,
      subject,
      customer,
      email,
      description,
      orderId: newTicket.orderId.trim() || "—",
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setTickets((previous) => [ticket, ...previous]);
    setNewTicket({ ...emptyTicket });
    setNewTicketOpen(false);
    setFormError("");
    notify(`Support ticket #${ticket.id} created in the demo.`);
  }

  function handleReply(event) {
    event.preventDefault();

    if (!selectedTicket) return;

    const message = replyText.trim();

    if (!message) {
      setFormError("Enter a reply before submitting.");
      return;
    }

    const reply = {
      id: Date.now(),
      sender: "Admin",
      message,
      date: new Date().toISOString(),
    };

    updateTicket(selectedTicket.id, {
      replies: [...(selectedTicket.replies || []), reply],
    });

    setReplyText("");
    setFormError("");
    notify("Demo reply added to the ticket.");
  }

  function changeSelectedStatus(status) {
    if (!selectedTicket) return;

    updateTicket(selectedTicket.id, { status });
    notify(`Ticket #${selectedTicket.id} marked ${status.toLowerCase()}.`);
  }

  function changeSelectedPriority(priority) {
    if (!selectedTicket) return;

    updateTicket(selectedTicket.id, { priority });
    notify(`Ticket #${selectedTicket.id} priority updated.`);
  }

  function deleteTicket(ticket) {
    const confirmed = window.confirm(
      `Delete support ticket #${ticket.id}?`
    );

    if (!confirmed) return;

    setTickets((previous) =>
      previous.filter((item) => item.id !== ticket.id)
    );

    if (selectedTicketId === ticket.id) {
      setSelectedTicketId(null);
    }

    notify(`Ticket #${ticket.id} deleted from the demo.`);
  }

  function resetDemo() {
    if (!window.confirm("Restore the original support ticket examples?")) {
      return;
    }

    setTickets(defaultTickets);
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setRoleFilter("All");
    setSelectedTicketId(null);
    notify("Sample support tickets restored.");
  }

  return (
    <div className="asup-page">
      <div className="asup-heading">
        <div>
          <p className="asup-eyebrow">CUSTOMER EXPERIENCE</p>
          <h1>Support Centre</h1>
          <p className="asup-subtitle">
            Review customer and seller questions and track support resolutions.
          </p>
        </div>

        <div className="asup-heading-actions">
          <button
            type="button"
            className="asup-secondary-btn"
            onClick={resetDemo}
          >
            <RefreshCw size={16} />
            Reset demo
          </button>

          <button
            type="button"
            className="asup-primary-btn"
            onClick={() => {
              setNewTicket({ ...emptyTicket });
              setFormError("");
              setNewTicketOpen(true);
            }}
          >
            <Plus size={17} />
            Create ticket
          </button>
        </div>
      </div>

      {notice && (
        <div className="asup-notice" role="status">
          <CheckCircle2 size={17} />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="asup-stat-grid">
        <div className="asup-stat-card">
          <div className="asup-stat-icon asup-green">
            <Headphones size={22} />
          </div>
          <div>
            <p>Total tickets</p>
            <h2>{tickets.length}</h2>
            <span>All recorded demo tickets</span>
          </div>
        </div>

        <div className="asup-stat-card">
          <div className="asup-stat-icon asup-orange">
            <Clock3 size={22} />
          </div>
          <div>
            <p>Open tickets</p>
            <h2>{openCount}</h2>
            <span>Waiting for action</span>
          </div>
        </div>

        <div className="asup-stat-card">
          <div className="asup-stat-icon asup-blue">
            <MessageCircle size={22} />
          </div>
          <div>
            <p>In progress</p>
            <h2>{inProgressCount}</h2>
            <span>Being handled</span>
          </div>
        </div>

        <div className="asup-stat-card">
          <div className="asup-stat-icon asup-red">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p>Urgent unresolved</p>
            <h2>{urgentCount}</h2>
            <span>{resolvedCount} tickets resolved</span>
          </div>
        </div>
      </div>

      <section className="asup-panel">
        <div className="asup-panel-heading">
          <div>
            <h2>Support tickets</h2>
            <p>View complaints, update priorities and track resolutions.</p>
          </div>

          <span className="asup-count-pill">
            {filteredTickets.length} shown
          </span>
        </div>

        <div className="asup-toolbar">
          <div className="asup-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search ticket, customer, email or order..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search support tickets"
            />
          </div>

          <select
            className="asup-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by ticket status"
          >
            <option value="All">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="asup-filter"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            aria-label="Filter by priority"
          >
            <option value="All">All priorities</option>
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>

          <select
            className="asup-filter"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label="Filter by user type"
          >
            <option value="All">All users</option>
            <option value="Customer">Customer</option>
            <option value="Seller">Seller</option>
          </select>
        </div>

        <div className="asup-table-wrap">
          <table className="asup-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Customer / Seller</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <div className="asup-ticket-cell">
                      <strong>#{ticket.id}</strong>
                      <span>{ticket.subject}</span>
                      {ticket.orderId !== "—" && (
                        <small>Order: {ticket.orderId}</small>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="asup-customer-cell">
                      <div className="asup-avatar">
                        {ticket.customer.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <strong>{ticket.customer}</strong>
                        <span>{ticket.role}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="asup-category">
                      {ticket.category}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`asup-priority asup-priority-${priorityClass(
                        ticket.priority
                      )}`}
                    >
                      <span />
                      {ticket.priority}
                    </span>
                  </td>

                  <td className="asup-date">{formatDate(ticket.createdAt)}</td>

                  <td>
                    <span
                      className={`asup-status asup-status-${statusClass(
                        ticket.status
                      )}`}
                    >
                      <span />
                      {ticket.status}
                    </span>
                  </td>

                  <td>
                    <div className="asup-row-actions">
                      <button
                        type="button"
                        className="asup-icon-btn"
                        onClick={() => {
                          setSelectedTicketId(ticket.id);
                          setReplyText("");
                          setFormError("");
                        }}
                        title="View ticket details"
                        aria-label={`View ticket ${ticket.id}`}
                      >
                        <Eye size={16} />
                      </button>

                      {ticket.status !== "Resolved" && (
                        <button
                          type="button"
                          className="asup-resolve-btn"
                          onClick={() => {
                            updateTicket(ticket.id, { status: "Resolved" });
                            notify(`Ticket #${ticket.id} resolved in the demo.`);
                          }}
                        >
                          Resolve
                        </button>
                      )}

                      <button
                        type="button"
                        className="asup-icon-btn asup-delete-btn"
                        onClick={() => deleteTicket(ticket)}
                        title="Delete ticket"
                        aria-label={`Delete ticket ${ticket.id}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="asup-empty">
                      <Headphones size={30} />
                      <h3>No support tickets found</h3>
                      <p>Try another search or clear your filters.</p>
                      <button
                        type="button"
                        className="asup-secondary-btn"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("All");
                          setPriorityFilter("All");
                          setRoleFilter("All");
                        }}
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="asup-demo-note">
          <CheckCircle2 size={15} />
          Sample records only. Replies and status changes are stored locally
          in this browser and are not sent to real customers or sellers.
        </p>
      </section>

      {selectedTicket && (
        <div
          className="asup-modal-backdrop"
          onMouseDown={() => setSelectedTicketId(null)}
        >
          <section
            className="asup-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="asup-detail-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="asup-modal-header">
              <div>
                <p className="asup-eyebrow">SUPPORT REQUEST #{selectedTicket.id}</p>
                <h2 id="asup-detail-title">{selectedTicket.subject}</h2>
              </div>

              <button
                className="asup-modal-close"
                type="button"
                onClick={() => setSelectedTicketId(null)}
                aria-label="Close ticket details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="asup-detail-customer">
              <div className="asup-avatar asup-avatar-large">
                {selectedTicket.customer.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <strong>{selectedTicket.customer}</strong>
                <span>{selectedTicket.email}</span>
                <small>{selectedTicket.role}</small>
              </div>
            </div>

            <div className="asup-detail-meta">
              <div>
                <span>Category</span>
                <strong>{selectedTicket.category}</strong>
              </div>
              <div>
                <span>Order ID</span>
                <strong>{selectedTicket.orderId || "—"}</strong>
              </div>
              <div>
                <span>Created on</span>
                <strong>{formatDate(selectedTicket.createdAt)}</strong>
              </div>
            </div>

            <div className="asup-complaint">
              <h3>Complaint details</h3>
              <p>{selectedTicket.description}</p>
            </div>

            <div className="asup-admin-controls">
              <label className="asup-field">
                <span>Ticket status</span>
                <select
                  value={selectedTicket.status}
                  onChange={(event) =>
                    changeSelectedStatus(event.target.value)
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="asup-field">
                <span>Priority</span>
                <select
                  value={selectedTicket.priority}
                  onChange={(event) =>
                    changeSelectedPriority(event.target.value)
                  }
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="asup-replies">
              <h3>Conversation</h3>

              {(selectedTicket.replies || []).length === 0 && (
                <p className="asup-no-replies">
                  No replies have been added to this demo ticket.
                </p>
              )}

              {(selectedTicket.replies || []).map((reply) => (
                <div className="asup-reply" key={reply.id}>
                  <div className="asup-reply-header">
                    <strong>
                      <UserRound size={14} />
                      {reply.sender}
                    </strong>
                    <span>{formatDate(reply.date)}</span>
                  </div>
                  <p>{reply.message}</p>
                </div>
              ))}

              <form className="asup-reply-form" onSubmit={handleReply}>
                <label className="asup-field">
                  <span>Add internal demo reply</span>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    placeholder="Write a response or internal note..."
                  />
                </label>

                {formError && !newTicketOpen && (
                  <p className="asup-form-error" role="alert">
                    {formError}
                  </p>
                )}

                <button type="submit" className="asup-primary-btn">
                  <Send size={15} />
                  Add reply
                </button>
              </form>
            </div>

            <div className="asup-modal-footer">
              <button
                type="button"
                className="asup-secondary-btn"
                onClick={() => setSelectedTicketId(null)}
              >
                Close
              </button>

              {selectedTicket.status !== "Resolved" && (
                <button
                  type="button"
                  className="asup-primary-btn"
                  onClick={() => changeSelectedStatus("Resolved")}
                >
                  <CheckCircle2 size={16} />
                  Mark resolved
                </button>
              )}
            </div>
          </section>
        </div>
      )}

      {newTicketOpen && (
        <div
          className="asup-modal-backdrop"
          onMouseDown={() => setNewTicketOpen(false)}
        >
          <section
            className="asup-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="asup-create-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="asup-modal-header">
              <div>
                <p className="asup-eyebrow">SUPPORT MANAGEMENT</p>
                <h2 id="asup-create-title">Create support ticket</h2>
              </div>
              <button
                className="asup-modal-close"
                type="button"
                onClick={() => {
                  setNewTicketOpen(false);
                  setFormError("");
                }}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="asup-create-form"
              onSubmit={handleCreateTicket}
            >
              <label className="asup-field">
                <span>Issue title *</span>
                <input
                  value={newTicket.subject}
                  onChange={(event) =>
                    setNewTicket((previous) => ({
                      ...previous,
                      subject: event.target.value,
                    }))
                  }
                  placeholder="Enter the complaint title"
                  required
                />
              </label>

              <div className="asup-form-row">
                <label className="asup-field">
                  <span>Customer or seller name *</span>
                  <input
                    value={newTicket.customer}
                    onChange={(event) =>
                      setNewTicket((previous) => ({
                        ...previous,
                        customer: event.target.value,
                      }))
                    }
                    placeholder="Full name or store"
                    required
                  />
                </label>

                <label className="asup-field">
                  <span>User type</span>
                  <select
                    value={newTicket.role}
                    onChange={(event) =>
                      setNewTicket((previous) => ({
                        ...previous,
                        role: event.target.value,
                      }))
                    }
                  >
                    <option value="Customer">Customer</option>
                    <option value="Seller">Seller</option>
                  </select>
                </label>
              </div>

              <label className="asup-field">
                <span>Email address *</span>
                <input
                  type="email"
                  value={newTicket.email}
                  onChange={(event) =>
                    setNewTicket((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  placeholder="user@example.com"
                  required
                />
              </label>

              <div className="asup-form-row">
                <label className="asup-field">
                  <span>Category</span>
                  <select
                    value={newTicket.category}
                    onChange={(event) =>
                      setNewTicket((previous) => ({
                        ...previous,
                        category: event.target.value,
                      }))
                    }
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="asup-field">
                  <span>Priority</span>
                  <select
                    value={newTicket.priority}
                    onChange={(event) =>
                      setNewTicket((previous) => ({
                        ...previous,
                        priority: event.target.value,
                      }))
                    }
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="asup-field">
                <span>Related order ID</span>
                <input
                  value={newTicket.orderId}
                  onChange={(event) =>
                    setNewTicket((previous) => ({
                      ...previous,
                      orderId: event.target.value,
                    }))
                  }
                  placeholder="Optional order ID"
                />
              </label>

              <label className="asup-field">
                <span>Complaint details *</span>
                <textarea
                  rows={4}
                  value={newTicket.description}
                  onChange={(event) =>
                    setNewTicket((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe the issue..."
                  required
                />
              </label>

              {formError && (
                <p className="asup-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="asup-modal-footer">
                <button
                  type="button"
                  className="asup-secondary-btn"
                  onClick={() => {
                    setNewTicketOpen(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="asup-primary-btn">
                  <Plus size={16} />
                  Create ticket
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
