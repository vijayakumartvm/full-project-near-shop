
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  CreditCard,
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
  Eye,
  X,
  RefreshCw,
  Download,
  ArrowUpRight,
  Wallet,
  ShoppingBag,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";

import "./Admin_Payments.css";

const STORAGE_KEY = "nearshopAdminPayments";

const defaultPayments = [
  {
    id: 1,
    transactionId: "NS-TXN-10001",
    orderId: "NS-ORD-5001",
    customer: "Arun Kumar",
    email: "arun@example.com",
    method: "UPI",
    amount: 2450,
    date: "2026-10-22T09:30:00",
    status: "Completed",
    description: "Grocery order payment",
    refundedAmount: 0,
  },
  {
    id: 2,
    transactionId: "NS-TXN-10002",
    orderId: "NS-ORD-5002",
    customer: "Priya Devi",
    email: "priya@example.com",
    method: "Credit Card",
    amount: 5800,
    date: "2026-10-22T08:15:00",
    status: "Completed",
    description: "Weekly grocery order",
    refundedAmount: 0,
  },
  {
    id: 3,
    transactionId: "NS-TXN-10003",
    orderId: "NS-ORD-5003",
    customer: "Karthik Raj",
    email: "karthik@example.com",
    method: "UPI",
    amount: 1299,
    date: "2026-10-21T17:45:00",
    status: "Pending",
    description: "Fresh vegetables and fruits",
    refundedAmount: 0,
  },
  {
    id: 4,
    transactionId: "NS-TXN-10004",
    orderId: "NS-ORD-5004",
    customer: "Meena Lakshmi",
    email: "meena@example.com",
    method: "Net Banking",
    amount: 3400,
    date: "2026-10-21T15:20:00",
    status: "Completed",
    description: "Monthly grocery order",
    refundedAmount: 0,
  },
  {
    id: 5,
    transactionId: "NS-TXN-10005",
    orderId: "NS-ORD-5005",
    customer: "Vijay Kumar",
    email: "vijay@example.com",
    method: "UPI",
    amount: 750,
    date: "2026-10-21T13:10:00",
    status: "Failed",
    description: "Grocery order payment",
    refundedAmount: 0,
  },
  {
    id: 6,
    transactionId: "NS-TXN-10006",
    orderId: "NS-ORD-5006",
    customer: "Divya S",
    email: "divya@example.com",
    method: "Wallet",
    amount: 1850,
    date: "2026-10-20T18:35:00",
    status: "Refunded",
    description: "Cancelled grocery order",
    refundedAmount: 1850,
  },
  {
    id: 7,
    transactionId: "NS-TXN-10007",
    orderId: "NS-ORD-5007",
    customer: "Ramesh B",
    email: "ramesh@example.com",
    method: "Debit Card",
    amount: 4200,
    date: "2026-10-20T11:05:00",
    status: "Completed",
    description: "Bulk grocery order",
    refundedAmount: 0,
  },
  {
    id: 8,
    transactionId: "NS-TXN-10008",
    orderId: "NS-ORD-5008",
    customer: "Anitha R",
    email: "anitha@example.com",
    method: "UPI",
    amount: 920,
    date: "2026-10-19T16:40:00",
    status: "Pending",
    description: "Daily grocery order",
    refundedAmount: 0,
  },
];

function readPayments() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultPayments;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : defaultPayments;
  } catch (error) {
    console.error("Could not load payments:", error);
    return defaultPayments;
  }
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

function exportCsv(rows) {
  const columns = [
    "transactionId",
    "orderId",
    "customer",
    "email",
    "method",
    "amount",
    "date",
    "status",
    "refundedAmount",
  ];

  const escapeCsv = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csv = [
    columns.join(","),
    ...rows.map((row) =>
      columns.map((column) => escapeCsv(row[column])).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "nearshop-payments-demo.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function Admin_Payments() {
  const [payments, setPayments] = useState(readPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        payment.transactionId.toLowerCase().includes(query) ||
        payment.orderId.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query) ||
        payment.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const completedAmount = payments
    .filter((payment) => payment.status === "Completed")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const pendingAmount = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const refundedAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.refundedAmount || 0),
    0
  );

  const completedCount = payments.filter(
    (payment) => payment.status === "Completed"
  ).length;

  const pendingCount = payments.filter(
    (payment) => payment.status === "Pending"
  ).length;

  const failedCount = payments.filter(
    (payment) => payment.status === "Failed"
  ).length;

  function notify(message) {
    setNotice(message);
  }

  function updateStatus(id, newStatus) {
    const payment = payments.find((item) => item.id === id);
    if (!payment) return;

    if (payment.status === "Refunded") {
      notify("This demo payment is already marked as refunded.");
      return;
    }

    if (newStatus === "Refunded" && payment.status !== "Completed") {
      notify("Only completed payments can be marked for a demo refund.");
      return;
    }

    if (newStatus === "Completed" && payment.status === "Failed") {
      notify(
        "A failed payment cannot be marked successful without gateway verification."
      );
      return;
    }

    const message =
      newStatus === "Refunded"
        ? `Mark ${payment.transactionId} as refunded in this demo? No real money will be refunded.`
        : `Mark ${payment.transactionId} as completed in this demo?`;

    if (!window.confirm(message)) return;

    setPayments((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              refundedAmount:
                newStatus === "Refunded"
                  ? Number(item.amount)
                  : Number(item.refundedAmount || 0),
            }
          : item
      )
    );

    setSelectedPayment((previous) =>
      previous?.id === id
        ? {
            ...previous,
            status: newStatus,
            refundedAmount:
              newStatus === "Refunded"
                ? Number(previous.amount)
                : Number(previous.refundedAmount || 0),
          }
        : previous
    );

    notify(
      newStatus === "Refunded"
        ? "Payment marked as refunded in the demo only."
        : "Payment status updated in the demo."
    );
  }

  function resetDemo() {
    if (!window.confirm("Restore the original sample payment records?")) {
      return;
    }

    setPayments(defaultPayments);
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
    setSelectedPayment(null);
    notify("Sample payment records restored.");
  }

  return (
    <div className="apm-page">
      <div className="apm-heading">
        <div>
          <p className="apm-eyebrow">FINANCE & TRANSACTIONS</p>
          <h1>Payments</h1>
          <p className="apm-subtitle">
            Review customer payments, transaction statuses, and demo refunds.
          </p>
        </div>

        <div className="apm-heading-actions">
          <button
            type="button"
            className="apm-secondary-btn"
            onClick={resetDemo}
          >
            <RefreshCw size={16} />
            Reset demo
          </button>

          <button
            type="button"
            className="apm-primary-btn"
            onClick={() => exportCsv(filteredPayments)}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {notice && (
        <div className="apm-notice" role="status">
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

      <div className="apm-stat-grid">
        <div className="apm-stat-card">
          <div className="apm-stat-icon apm-green">
            <CircleDollarSign size={22} />
          </div>
          <div>
            <p>Completed payments</p>
            <h2>{money(completedAmount)}</h2>
            <span>{completedCount} successful demo transactions</span>
          </div>
        </div>

        <div className="apm-stat-card">
          <div className="apm-stat-icon apm-orange">
            <Clock3 size={22} />
          </div>
          <div>
            <p>Pending payments</p>
            <h2>{money(pendingAmount)}</h2>
            <span>{pendingCount} awaiting confirmation</span>
          </div>
        </div>

        <div className="apm-stat-card">
          <div className="apm-stat-icon apm-blue">
            <RotateCcw size={22} />
          </div>
          <div>
            <p>Refunded amount</p>
            <h2>{money(refundedAmount)}</h2>
            <span>Sample refund records</span>
          </div>
        </div>

        <div className="apm-stat-card">
          <div className="apm-stat-icon apm-red">
            <XCircle size={22} />
          </div>
          <div>
            <p>Failed payments</p>
            <h2>{failedCount}</h2>
            <span>Transactions not completed</span>
          </div>
        </div>
      </div>

      <section className="apm-panel">
        <div className="apm-panel-header">
          <div>
            <h2>Transaction history</h2>
            <p>Search and review payment records from the demo dataset.</p>
          </div>

          <span className="apm-count-pill">
            {filteredPayments.length} records
          </span>
        </div>

        <div className="apm-toolbar">
          <div className="apm-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search transaction, order, customer..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search payment records"
            />
          </div>

          <select
            className="apm-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter payment status"
          >
            <option value="All">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            className="apm-filter"
            value={methodFilter}
            onChange={(event) => setMethodFilter(event.target.value)}
            aria-label="Filter payment method"
          >
            <option value="All">All methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Wallet">Wallet</option>
          </select>
        </div>

        <div className="apm-table-wrap">
          <table className="apm-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Customer</th>
                <th>Payment method</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div className="apm-transaction">
                      <div className="apm-transaction-icon">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <strong>{payment.transactionId}</strong>
                        <span>Order: {payment.orderId}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="apm-customer">
                      <strong>{payment.customer}</strong>
                      <span>{payment.email}</span>
                    </div>
                  </td>

                  <td>
                    <span className="apm-method">
                      <Wallet size={15} />
                      {payment.method}
                    </span>
                  </td>

                  <td>
                    <strong className="apm-amount">
                      {money(payment.amount)}
                    </strong>
                    {payment.refundedAmount > 0 && (
                      <small className="apm-refund-hint">
                        Refunded: {money(payment.refundedAmount)}
                      </small>
                    )}
                  </td>

                  <td className="apm-date">{formatDate(payment.date)}</td>

                  <td>
                    <span
                      className={`apm-status apm-status-${payment.status.toLowerCase()}`}
                    >
                      <span />
                      {payment.status}
                    </span>
                  </td>

                  <td>
                    <div className="apm-row-actions">
                      <button
                        type="button"
                        className="apm-icon-btn"
                        onClick={() => setSelectedPayment(payment)}
                        title="View payment details"
                        aria-label={`View ${payment.transactionId}`}
                      >
                        <Eye size={16} />
                      </button>

                      {payment.status === "Pending" && (
                        <button
                          type="button"
                          className="apm-action-text"
                          onClick={() => updateStatus(payment.id, "Completed")}
                        >
                          Confirm demo
                        </button>
                      )}

                      {payment.status === "Completed" && (
                        <button
                          type="button"
                          className="apm-icon-btn apm-refund-btn"
                          onClick={() => updateStatus(payment.id, "Refunded")}
                          title="Mark as refunded in demo"
                          aria-label={`Mark ${payment.transactionId} refunded`}
                        >
                          <RotateCcw size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="apm-empty">
                      <CreditCard size={30} />
                      <h3>No transactions found</h3>
                      <p>Try another search term or clear the filters.</p>
                      <button
                        type="button"
                        className="apm-secondary-btn"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("All");
                          setMethodFilter("All");
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

        <p className="apm-demo-note">
          <CheckCircle2 size={15} />
          Demo records only. Amounts shown here are not verified gateway
          settlements or live bank transactions.
        </p>
      </section>

      {selectedPayment && (
        <div
          className="apm-modal-backdrop"
          onMouseDown={() => setSelectedPayment(null)}
        >
          <section
            className="apm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="apm-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="apm-modal-header">
              <div>
                <p className="apm-eyebrow">TRANSACTION DETAILS</p>
                <h2 id="apm-modal-title">Payment information</h2>
              </div>

              <button
                className="apm-modal-close"
                type="button"
                onClick={() => setSelectedPayment(null)}
                aria-label="Close payment details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="apm-modal-amount">
              <div className="apm-modal-payment-icon">
                <CreditCard size={24} />
              </div>
              <p>Transaction amount</p>
              <h3>{money(selectedPayment.amount)}</h3>
              <span
                className={`apm-status apm-status-${selectedPayment.status.toLowerCase()}`}
              >
                <span />
                {selectedPayment.status}
              </span>
            </div>

            <div className="apm-detail-list">
              <div>
                <span>Transaction ID</span>
                <strong>{selectedPayment.transactionId}</strong>
              </div>
              <div>
                <span>Order ID</span>
                <strong>{selectedPayment.orderId}</strong>
              </div>
              <div>
                <span>Customer</span>
                <strong>{selectedPayment.customer}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{selectedPayment.email}</strong>
              </div>
              <div>
                <span>Payment method</span>
                <strong>{selectedPayment.method}</strong>
              </div>
              <div>
                <span>Transaction date</span>
                <strong>{formatDate(selectedPayment.date)}</strong>
              </div>
              <div>
                <span>Description</span>
                <strong>{selectedPayment.description}</strong>
              </div>
              <div>
                <span>Refund amount</span>
                <strong>{money(selectedPayment.refundedAmount)}</strong>
              </div>
            </div>

            <div className="apm-modal-warning">
              <Clock3 size={16} />
              Refund and confirmation buttons update only the local demo.
              Connect a payment gateway before handling real transactions.
            </div>

            <div className="apm-modal-actions">
              {selectedPayment.status === "Completed" && (
                <button
                  type="button"
                  className="apm-secondary-btn apm-modal-refund"
                  onClick={() =>
                    updateStatus(selectedPayment.id, "Refunded")
                  }
                >
                  <RotateCcw size={15} />
                  Mark refunded (demo)
                </button>
              )}

              {selectedPayment.status === "Pending" && (
                <button
                  type="button"
                  className="apm-primary-btn"
                  onClick={() =>
                    updateStatus(selectedPayment.id, "Completed")
                  }
                >
                  Confirm demo payment
                </button>
              )}

              <button
                type="button"
                className="apm-primary-btn"
                onClick={() => setSelectedPayment(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
