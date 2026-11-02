
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Store,
  Users,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  MoreHorizontal,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import "./Admin_Dashboard.css";

/* Dashboard summary cards */
const stats = [
  {
    title: "Total Revenue",
    value: "₹2,45,680",
    change: "+12.5%",
    note: "vs last month",
    icon: Wallet,
    color: "green",
  },
  {
    title: "Total Orders",
    value: "1,284",
    change: "+8.2%",
    note: "vs last month",
    icon: ShoppingCart,
    color: "orange",
  },
  {
    title: "Active Sellers",
    value: "86",
    change: "+5.1%",
    note: "vs last month",
    icon: Store,
    color: "blue",
  },
  {
    title: "Total Customers",
    value: "3,462",
    change: "+10.3%",
    note: "vs last month",
    icon: Users,
    color: "purple",
  },
];

/* Sample monthly chart data */
const sales = [
  { month: "Jan", value: 20 },
  { month: "Feb", value: 34 },
  { month: "Mar", value: 29 },
  { month: "Apr", value: 47 },
  { month: "May", value: 40 },
  { month: "Jun", value: 62 },
  { month: "Jul", value: 55 },
  { month: "Aug", value: 84 },
];

/* Recent orders with grocery product images */
const recentOrders = [
  {
    id: "#NS1001",
    product: "Fresh Bananas",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=160&h=160&q=80",
    customer: "Priya Sharma",
    initials: "PS",
    items: "3 items",
    amount: 1250,
    status: "Delivered",
    date: "21 Oct 2026",
  },
  {
    id: "#NS1002",
    product: "Fresh Milk",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=160&h=160&q=80",
    customer: "Rahul Mehta",
    initials: "RM",
    items: "5 items",
    amount: 2340,
    status: "Processing",
    date: "21 Oct 2026",
  },
  {
    id: "#NS1003",
    product: "Red Tomatoes",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=160&h=160&q=80",
    customer: "Sneha Iyer",
    initials: "SI",
    items: "2 items",
    amount: 680,
    status: "Pending",
    date: "20 Oct 2026",
  },
  {
    id: "#NS1004",
    product: "Farm Fresh Eggs",
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=160&h=160&q=80",
    customer: "Arjun Kumar",
    initials: "AK",
    items: "4 items",
    amount: 1980,
    status: "Delivered",
    date: "20 Oct 2026",
  },
  {
    id: "#NS1005",
    product: "Fresh Vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=160&h=160&q=80",
    customer: "Neha Jain",
    initials: "NJ",
    items: "1 item",
    amount: 420,
    status: "Cancelled",
    date: "19 Oct 2026",
  },
];

/* Sample seller applications */
const pendingShops = [
  {
    id: "APP-1001",
    name: "Green Mart",
    owner: "Vikram Singh",
    date: "20 Oct 2026",
    initials: "GM",
    color: "shop-green",
  },
  {
    id: "APP-1002",
    name: "Daily Fresh",
    owner: "Anita Rao",
    date: "20 Oct 2026",
    initials: "DF",
    color: "shop-orange",
  },
  {
    id: "APP-1003",
    name: "Nature Basket",
    owner: "Suresh Kumar",
    date: "19 Oct 2026",
    initials: "NB",
    color: "shop-yellow",
  },
  {
    id: "APP-1004",
    name: "Farm to Home",
    owner: "Kavya Nair",
    date: "19 Oct 2026",
    initials: "FH",
    color: "shop-blue",
  },
];

/* Order status counts */
const orderBreakdown = [
  {
    label: "Delivered",
    count: 820,
    percentage: "63.9%",
    color: "delivered",
  },
  {
    label: "Processing",
    count: 210,
    percentage: "16.4%",
    color: "processing",
  },
  {
    label: "Pending",
    count: 168,
    percentage: "13.1%",
    color: "pending",
  },
  {
    label: "Cancelled",
    count: 86,
    percentage: "6.6%",
    color: "cancelled",
  },
];

function formatCurrency(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function Admin_Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="near-dashboard">
      {/* Dashboard heading */}
      <section className="nd-welcome">
        <div>
          <span className="nd-eyebrow">MARKETPLACE OVERVIEW</span>
          <h2>Dashboard Overview</h2>
          <p>
            Here’s what’s happening with your grocery marketplace today.
          </p>
        </div>

        <button
          className="nd-date-button"
          type="button"
          onClick={() =>
            window.alert("Date filtering will be added when the backend is connected.")
          }
        >
          <CalendarDays size={17} />
          <span>Last 30 Days</span>
          <ChevronDown size={15} />
        </button>
      </section>

      {/* Statistics cards */}
      <section className="nd-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="nd-stat-card" key={stat.title}>
              <div className={`nd-stat-icon ${stat.color}`}>
                <Icon size={22} strokeWidth={2} />
              </div>

              <div className="nd-stat-body">
                <p>{stat.title}</p>
                <h3>{stat.value}</h3>

                <div className="nd-stat-growth">
                  <TrendingUp size={12} />
                  <strong>{stat.change}</strong>
                  <span>{stat.note}</span>
                </div>
              </div>

              <div
                className={`nd-mini-chart ${stat.color}`}
                aria-hidden="true"
              >
                {[29, 44, 36, 56, 47, 69, 62, 91].map(
                  (height, index) => (
                    <span
                      key={index}
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* Sales analytics and redesigned Order Status */}
      <section className="nd-analytics-grid">
        {/* Sales Overview */}
        <article className="nd-panel nd-sales-panel">
          <div className="nd-panel-heading">
            <div>
              <h3>Sales Overview</h3>
              <p>Monthly marketplace revenue</p>
            </div>

            <button
              type="button"
              className="nd-period-button"
              onClick={() =>
                window.alert("Chart period selection will be added later.")
              }
            >
              This Year <ChevronDown size={14} />
            </button>
          </div>

          <div className="nd-chart-summary">
            <span className="nd-chart-dot" />
            <span>Revenue</span>
            <strong>₹2.45L</strong>
            <span className="nd-chart-growth">
              <ArrowUpRight size={14} />
              12.5%
            </span>
          </div>

          <div className="nd-sales-chart">
            <div className="nd-chart-y-axis">
              <span>₹80K</span>
              <span>₹60K</span>
              <span>₹40K</span>
              <span>₹20K</span>
              <span>₹0</span>
            </div>

            <div className="nd-chart-plot">
              <div className="nd-chart-grid">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <svg
                className="nd-chart-svg"
                viewBox="0 0 700 220"
                preserveAspectRatio="none"
                role="img"
                aria-label="Illustrative monthly revenue chart"
              >
                <defs>
                  <linearGradient
                    id="ndSalesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#2e9b53"
                      stopOpacity="0.22"
                    />
                    <stop
                      offset="100%"
                      stopColor="#2e9b53"
                      stopOpacity="0.01"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 165 L100 125 L200 140 L300 90 L400 115 L500 55 L600 75 L700 12 L700 220 L0 220 Z"
                  fill="url(#ndSalesGradient)"
                />

                <polyline
                  points="0,165 100,125 200,140 300,90 400,115 500,55 600,75 700,12"
                  fill="none"
                  stroke="#218447"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {sales.map((point, index) => (
                  <circle
                    key={point.month}
                    cx={index * 100}
                    cy={220 - point.value * 2.5}
                    r="4"
                    fill="#ffffff"
                    stroke="#218447"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              <div className="nd-chart-months">
                {sales.map((point) => (
                  <span key={point.month}>{point.month}</span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Redesigned right-side Order Status */}
        <article className="nd-panel nd-order-status-panel">
          <div className="nd-panel-heading">
            <div>
              <h3>Order Status</h3>
              <p>Track marketplace order fulfilment</p>
            </div>

            <button
              type="button"
              className="nd-more-button"
              aria-label="View reports"
              onClick={() => navigate("/admin/reports")}
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="nd-status-hero">
            <div className="nd-donut">
              <div className="nd-donut-center">
                <strong>1,284</strong>
                <span>Total Orders</span>
              </div>
            </div>

            <div className="nd-status-summary">
              <span className="nd-summary-label">
                ORDERS COMPLETED
              </span>

              <h2>
                820 <small>/ 1,284</small>
              </h2>

              <p>
                <CheckCircle2 size={14} />
                63.9% delivered
              </p>
            </div>
          </div>

          <div className="nd-status-details">
            {orderBreakdown.map((item) => (
              <div className="nd-status-row" key={item.label}>
                <div className="nd-status-row-heading">
                  <span className={`nd-status-dot ${item.color}`} />
                  <span className="nd-status-row-label">
                    {item.label}
                  </span>
                  <strong>{item.count}</strong>
                  <small>{item.percentage}</small>
                </div>

                <div
                  className="nd-status-track"
                  role="progressbar"
                  aria-label={`${item.label} orders`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Number.parseFloat(item.percentage)}
                >
                  <span
                    className={`nd-status-fill ${item.color}`}
                    style={{ width: item.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="nd-status-bottom">
            <div>
              <span className="nd-status-bottom-icon pending-icon">
                <Clock3 size={17} />
              </span>
              <div>
                <small>Pending Orders</small>
                <strong>168</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/reports")}
            >
              View Details <ArrowRight size={14} />
            </button>
          </div>
        </article>
      </section>

      {/* Recent Orders with product images */}
      <section className="nd-panel nd-table-panel">
        <div className="nd-panel-heading nd-table-heading">
          <div>
            <h3>Recent Orders</h3>
            <p>Latest customer purchases across the marketplace</p>
          </div>

          <button
            type="button"
            className="nd-view-all"
            onClick={() => navigate("/admin/reports")}
          >
            View Reports <ArrowRight size={15} />
          </button>
        </div>

        <div className="nd-table-scroll">
          <table className="nd-table nd-recent-orders-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>PRODUCT</th>
                <th>CUSTOMER</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="nd-order-id">{order.id}</td>

                  <td>
                    <div className="nd-product-cell">
                      <img
                        src={order.image}
                        alt={order.product}
                        className="nd-product-image"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />

                      <div className="nd-product-details">
                        <strong>{order.product}</strong>
                        <small>{order.items}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="nd-customer">
                      <span className="nd-customer-avatar">
                        {order.initials}
                      </span>
                      <strong>{order.customer}</strong>
                    </div>
                  </td>

                  <td className="nd-amount">
                    {formatCurrency(order.amount)}
                  </td>

                  <td>
                    <span
                      className={`nd-order-badge ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="nd-muted">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pending Shop Approvals */}
      <section className="nd-panel nd-table-panel nd-approvals-panel">
        <div className="nd-panel-heading nd-table-heading">
          <div>
            <h3>Pending Shop Approvals</h3>
            <p>Review applications from local grocery stores</p>
          </div>

          <button
            type="button"
            className="nd-view-all"
            onClick={() => navigate("/admin/shop-approvals")}
          >
            View All <ArrowRight size={15} />
          </button>
        </div>

        <div className="nd-table-scroll">
          <table className="nd-table">
            <thead>
              <tr>
                <th>SHOP</th>
                <th>OWNER</th>
                <th>APPLIED ON</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {pendingShops.map((shop) => (
                <tr key={shop.id}>
                  <td>
                    <div className="nd-shop">
                      <span className={`nd-shop-avatar ${shop.color}`}>
                        {shop.initials}
                      </span>
                      <strong>{shop.name}</strong>
                    </div>
                  </td>

                  <td>{shop.owner}</td>
                  <td className="nd-muted">{shop.date}</td>

                  <td>
                    <span className="nd-shop-pending">
                      <Clock3 size={12} />
                      Pending
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="nd-review-button"
                      onClick={() =>
                        navigate("/admin/shop-approvals")
                      }
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="nd-demo-note">
          <CheckCircle2 size={16} />
          <span>
            Sample data is displayed. Live orders and seller applications
            will appear after connecting the shared backend.
          </span>
        </div>
      </section>
    </div>
  );
}

export default Admin_Dashboard;
