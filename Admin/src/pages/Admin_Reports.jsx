
import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  IndianRupee,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Package,
  RefreshCw,
  FileBarChart,
} from "lucide-react";
import "./Admin_Reports.css";

const monthlyData = [
  { month: "Jan", revenue: 42000, orders: 120 },
  { month: "Feb", revenue: 51000, orders: 145 },
  { month: "Mar", revenue: 47000, orders: 132 },
  { month: "Apr", revenue: 63000, orders: 180 },
  { month: "May", revenue: 58000, orders: 168 },
  { month: "Jun", revenue: 76000, orders: 215 },
  { month: "Jul", revenue: 69000, orders: 198 },
  { month: "Aug", revenue: 84000, orders: 239 },
  { month: "Sep", revenue: 79000, orders: 226 },
  { month: "Oct", revenue: 92000, orders: 270 },
  { month: "Nov", revenue: 88000, orders: 252 },
  { month: "Dec", revenue: 105000, orders: 310 },
];

const topProducts = [
  { name: "Fresh Tomatoes", category: "Vegetables", sold: 865, revenue: 25950 },
  { name: "Organic Bananas", category: "Fruits", sold: 742, revenue: 37100 },
  { name: "A2 Cow Milk", category: "Dairy", sold: 625, revenue: 37500 },
  { name: "Basmati Rice", category: "Groceries", sold: 518, revenue: 46620 },
  { name: "Fresh Spinach", category: "Vegetables", sold: 486, revenue: 14580 },
];

const categoryData = [
  { name: "Vegetables", percentage: 32, revenue: 125000 },
  { name: "Fruits", percentage: 25, revenue: 98000 },
  { name: "Groceries", percentage: 22, revenue: 86000 },
  { name: "Dairy", percentage: 14, revenue: 55000 },
  { name: "Other", percentage: 7, revenue: 27500 },
];

const demoSummary = {
  today: { revenue: 18450, orders: 86, average: 214.53, products: 48 },
  week: { revenue: 126800, orders: 542, average: 233.95, products: 184 },
  month: { revenue: 482500, orders: 2186, average: 220.72, products: 325 },
  year: { revenue: 5240000, orders: 24650, average: 212.58, products: 1450 },
};

function formatRupees(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function downloadCSV(filename, rows) {
  if (!rows.length) return;

  const escapeCSV = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csv = rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function Admin_Reports() {
  const [period, setPeriod] = useState("month");
  const [year, setYear] = useState("2026");
  const [category, setCategory] = useState("All categories");
  const [reportType, setReportType] = useState("Sales report");
  const [notice, setNotice] = useState("");

  const summary = demoSummary[period];

  const filteredProducts = useMemo(() => {
    if (category === "All categories") return topProducts;
    return topProducts.filter((product) => product.category === category);
  }, [category]);

  const displayedMonthlyData = useMemo(() => {
    if (year === "2026") return monthlyData;
    return monthlyData.map((item) => ({
      ...item,
      revenue: Math.round(item.revenue * 0.82),
      orders: Math.round(item.orders * 0.9),
    }));
  }, [year]);

  const maxRevenue = Math.max(
    ...displayedMonthlyData.map((item) => item.revenue)
  );

  const handleExport = () => {
    const rows = [
      ["NearShop Admin Report"],
      ["Report type", reportType],
      ["Selected period", period],
      ["Selected year", year],
      ["Category filter", category],
      [],
      ["Summary metric", "Value"],
      ["Revenue", summary.revenue],
      ["Orders", summary.orders],
      ["Average order value", summary.average.toFixed(2)],
      ["Products sold", summary.products],
      [],
      ["Top product", "Category", "Units sold", "Revenue"],
      ...filteredProducts.map((product) => [
        product.name,
        product.category,
        product.sold,
        product.revenue,
      ]),
      [],
      ["Category", "Share (%)", "Revenue"],
      ...categoryData.map((item) => [
        item.name,
        item.percentage,
        item.revenue,
      ]),
    ];

    downloadCSV(
      `nearshop-${reportType.toLowerCase().replaceAll(" ", "-")}-${year}.csv`,
      rows
    );
    setNotice("Report exported successfully.");
  };

  const handleReset = () => {
    setPeriod("month");
    setYear("2026");
    setCategory("All categories");
    setReportType("Sales report");
    setNotice("Report filters have been reset.");
  };

  return (
    <section className="ar-page">
      <div className="ar-page-heading">
        <div>
          <span className="ar-eyebrow">BUSINESS ANALYTICS</span>
          <h1>Reports & Analytics</h1>
          <p>Track marketplace performance and review sales insights.</p>
        </div>

        <button className="ar-export-btn" onClick={handleExport}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {notice && (
        <div className="ar-notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}

      <div className="ar-filter-panel">
        <div className="ar-filter-title">
          <CalendarDays size={19} />
          <strong>Report filters</strong>
        </div>

        <div className="ar-filters">
          <label>
            Report type
            <select
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
            >
              <option>Sales report</option>
              <option>Orders report</option>
              <option>Product report</option>
              <option>Category report</option>
            </select>
          </label>

          <label>
            Reporting period
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="year">This year</option>
            </select>
          </label>

          <label>
            Year
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </label>

          <label>
            Product category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>All categories</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Dairy</option>
              <option>Groceries</option>
            </select>
          </label>

          <button className="ar-reset-btn" onClick={handleReset}>
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="ar-section-heading">
        <div>
          <h2>Performance overview</h2>
          <p>Summary for the selected reporting period</p>
        </div>
        <span className="ar-demo-label">DEMO DATA</span>
      </div>

      <div className="ar-stat-grid">
        <article className="ar-stat-card">
          <div className="ar-stat-top">
            <span>Total revenue</span>
            <span className="ar-stat-icon green">
              <IndianRupee size={21} />
            </span>
          </div>
          <h3>{formatRupees(summary.revenue)}</h3>
          <div className="ar-stat-foot">
            <TrendingUp size={15} />
            <span>Sample marketplace revenue</span>
          </div>
        </article>

        <article className="ar-stat-card">
          <div className="ar-stat-top">
            <span>Total orders</span>
            <span className="ar-stat-icon blue">
              <ShoppingCart size={21} />
            </span>
          </div>
          <h3>{summary.orders.toLocaleString("en-IN")}</h3>
          <div className="ar-stat-foot muted">
            <ShoppingBag size={15} />
            <span>Orders in selected period</span>
          </div>
        </article>

        <article className="ar-stat-card">
          <div className="ar-stat-top">
            <span>Average order value</span>
            <span className="ar-stat-icon orange">
              <IndianRupee size={21} />
            </span>
          </div>
          <h3>{formatRupees(summary.average)}</h3>
          <div className="ar-stat-foot muted">
            <FileBarChart size={15} />
            <span>Average value per order</span>
          </div>
        </article>

        <article className="ar-stat-card">
          <div className="ar-stat-top">
            <span>Products sold</span>
            <span className="ar-stat-icon purple">
              <Package size={21} />
            </span>
          </div>
          <h3>{summary.products.toLocaleString("en-IN")}</h3>
          <div className="ar-stat-foot muted">
            <ShoppingBag size={15} />
            <span>Units in selected period</span>
          </div>
        </article>
      </div>

      <div className="ar-main-grid">
        <article className="ar-card ar-chart-card">
          <div className="ar-card-heading">
            <div>
              <h2>Monthly sales overview</h2>
              <p>Revenue by month for {year}</p>
            </div>
            <span className="ar-chart-unit">Revenue (₹)</span>
          </div>

          <div className="ar-chart">
            <div className="ar-chart-y-labels">
              <span>₹{Math.round(maxRevenue / 1000)}k</span>
              <span>₹{Math.round(maxRevenue * 0.75 / 1000)}k</span>
              <span>₹{Math.round(maxRevenue * 0.5 / 1000)}k</span>
              <span>₹{Math.round(maxRevenue * 0.25 / 1000)}k</span>
              <span>₹0</span>
            </div>

            <div className="ar-chart-plot">
              <div className="ar-chart-grid-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="ar-bars">
                {displayedMonthlyData.map((item) => (
                  <div className="ar-bar-group" key={item.month}>
                    <div className="ar-bar-track">
                      <div
                        className="ar-bar"
                        style={{
                          height: `${(item.revenue / maxRevenue) * 100}%`,
                        }}
                        title={`${item.month}: ${formatRupees(item.revenue)}`}
                      />
                    </div>
                    <span className="ar-bar-label">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ar-chart-legend">
            <span className="ar-legend-dot" />
            Monthly revenue
          </div>
        </article>

        <article className="ar-card ar-category-card">
          <div className="ar-card-heading">
            <div>
              <h2>Category performance</h2>
              <p>Share of sample sales revenue</p>
            </div>
          </div>

          <div className="ar-category-list">
            {categoryData.map((item, index) => (
              <div className="ar-category-row" key={item.name}>
                <div className="ar-category-info">
                  <span className={`ar-category-dot dot-${index}`} />
                  <span className="ar-category-name">{item.name}</span>
                  <strong>{item.percentage}%</strong>
                </div>
                <div className="ar-category-track">
                  <span
                    className={`ar-category-fill fill-${index}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="ar-category-revenue">
                  {formatRupees(item.revenue)}
                </div>
              </div>
            ))}
          </div>

          <div className="ar-category-total">
            <span>Total listed category revenue</span>
            <strong>
              {formatRupees(
                categoryData.reduce((total, item) => total + item.revenue, 0)
              )}
            </strong>
          </div>
        </article>
      </div>

      <article className="ar-card ar-products-card">
        <div className="ar-card-heading ar-products-heading">
          <div>
            <h2>Top-selling products</h2>
            <p>Best-performing products in the sample report</p>
          </div>
          <span className="ar-product-count">
            {filteredProducts.length} products
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="ar-table-wrap">
            <table className="ar-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Units sold</th>
                  <th>Revenue</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.name}>
                    <td>
                      <div className="ar-product-cell">
                        <span className="ar-product-rank">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="ar-category-tag">
                        {product.category}
                      </span>
                    </td>
                    <td>{product.sold.toLocaleString("en-IN")}</td>
                    <td className="ar-money-cell">
                      {formatRupees(product.revenue)}
                    </td>
                    <td>
                      <div className="ar-product-performance">
                        <span
                          style={{
                            width: `${Math.min(
                              (product.sold / topProducts[0].sold) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ar-empty">
            No sample products are available for this category.
          </div>
        )}
      </article>

      <div className="ar-report-note">
        <div className="ar-report-note-icon">
          <FileBarChart size={21} />
        </div>
        <div>
          <strong>About these reports</strong>
          <p>
            This version uses sample frontend data. Connect the Admin Reports
            page to your backend APIs and database before using it for real
            sales, seller settlements, customer orders, or accounting.
          </p>
        </div>
      </div>
    </section>
  );
}
