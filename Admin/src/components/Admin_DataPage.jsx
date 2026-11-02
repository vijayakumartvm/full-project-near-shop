import React, { useEffect, useMemo, useState } from "react";
import "./Admin_DataPage.css";

function readStoredData(storageKey, fallbackData) {
  try {
    const stored = localStorage.getItem(storageKey);

    if (stored !== null) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed.map((item, index) => ({
          ...item,
          id: item.id ?? `${storageKey}-${index + 1}`,
        }));
      }
    }
  } catch (error) {
    console.error("Unable to read admin data:", error);
  }

  return fallbackData.map((item, index) => ({
    ...item,
    id: item.id ?? `${storageKey}-${index + 1}`,
  }));
}

function Admin_DataPage({
  title = "Manage Data",
  description = "View and manage marketplace records.",
  storageKey = "nearshopAdminData",
  singularLabel = "Record",
  columns = [],
  fields = [],
  initialData = [],
  addButtonLabel,
}) {
  const [records, setRecords] = useState(() =>
    readStoredData(storageKey, initialData)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(records));
    } catch (error) {
      console.error("Unable to save admin data:", error);
      setMessage("Unable to save data in browser storage.");
    }
  }, [records, storageKey]);

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        Object.values(record).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query)
        );

      const recordStatus = String(record.status ?? "All").toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        recordStatus === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const openAddForm = () => {
    const emptyForm = {};

    fields.forEach((field) => {
      emptyForm[field.name] = field.defaultValue ?? "";
    });

    setEditingId(null);
    setFormData(emptyForm);
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setEditingId(record.id);
    setFormData({ ...record });
    setMessage("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!fields.length) {
      setMessage("No form fields have been configured for this page.");
      return;
    }

    if (editingId !== null) {
      setRecords((previous) =>
        previous.map((record) =>
          record.id === editingId
            ? { ...record, ...formData, id: record.id }
            : record
        )
      );

      setMessage(`${singularLabel} updated successfully.`);
    } else {
      const newRecord = {
        ...formData,
        id: `${storageKey}-${Date.now()}`,
      };

      setRecords((previous) => [newRecord, ...previous]);

      setMessage(`${singularLabel} added successfully.`);
    }

    closeForm();
  };

  const handleDelete = (record) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${singularLabel.toLowerCase()}?`
    );

    if (!confirmed) return;

    setRecords((previous) =>
      previous.filter((item) => item.id !== record.id)
    );

    setMessage(`${singularLabel} deleted successfully.`);
  };

  const handleStatusChange = (record) => {
    const nextStatus =
      String(record.status).toLowerCase() === "active"
        ? "Inactive"
        : "Active";

    setRecords((previous) =>
      previous.map((item) =>
        item.id === record.id
          ? { ...item, status: nextStatus }
          : item
      )
    );

    setMessage(`${singularLabel} status updated.`);
  };

  const getCellValue = (record, column) => {
    const key = typeof column === "string" ? column : column.key;
    const value = record[key];

    if (value === null || value === undefined || value === "") {
      return "—";
    }

    if (key.toLowerCase().includes("amount") ||
        key.toLowerCase().includes("price") ||
        key.toLowerCase().includes("total")) {
      if (typeof value === "number") {
        return `₹${value.toLocaleString("en-IN")}`;
      }
    }

    return String(value);
  };

  const getStatusClass = (status) => {
    const value = String(status ?? "").toLowerCase();

    if (["active", "approved", "paid", "resolved"].includes(value)) {
      return "admin-data-status success";
    }

    if (["pending", "processing", "open"].includes(value)) {
      return "admin-data-status pending";
    }

    if (["inactive", "rejected", "failed", "closed"].includes(value)) {
      return "admin-data-status danger";
    }

    return "admin-data-status neutral";
  };

  return (
    <section className="admin-data-page">
      <div className="admin-page-heading">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {fields.length > 0 && (
          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddForm}
          >
            <span>＋</span>
            {addButtonLabel || `Add ${singularLabel}`}
          </button>
        )}
      </div>

      <div className="admin-data-summary">
        <div className="admin-data-summary-card">
          <span className="admin-data-summary-icon">▤</span>

          <div>
            <p>Total Records</p>
            <h2>{records.length}</h2>
          </div>
        </div>

        <div className="admin-data-summary-card">
          <span className="admin-data-summary-icon green">✓</span>

          <div>
            <p>Active Records</p>
            <h2>
              {
                records.filter(
                  (record) =>
                    String(record.status).toLowerCase() === "active" ||
                    String(record.status).toLowerCase() === "approved"
                ).length
              }
            </h2>
          </div>
        </div>

        <div className="admin-data-summary-card">
          <span className="admin-data-summary-icon orange">◷</span>

          <div>
            <p>Pending Records</p>
            <h2>
              {
                records.filter(
                  (record) =>
                    String(record.status).toLowerCase() === "pending"
                ).length
              }
            </h2>
          </div>
        </div>
      </div>

      {message && (
        <div className="admin-data-message" role="status">
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div className="admin-panel admin-data-panel">
        <div className="admin-data-toolbar">
          <div className="admin-data-search">
            <span aria-hidden="true">⌕</span>

            <input
              type="search"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label={`Search ${title}`}
            />
          </div>

          <select
            className="admin-data-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Paid">Paid</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="admin-data-table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                {columns.map((column) => {
                  const key =
                    typeof column === "string" ? column : column.key;

                  const label =
                    typeof column === "string"
                      ? column.replace(/([A-Z])/g, " $1")
                      : column.label;

                  return <th key={key}>{label}</th>;
                })}

                <th className="admin-data-actions-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  {columns.map((column) => {
                    const key =
                      typeof column === "string" ? column : column.key;

                    const value = getCellValue(record, column);

                    return (
                      <td key={key}>
                        {key.toLowerCase() === "status" ? (
                          <span className={getStatusClass(record[key])}>
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}

                  <td>
                    <div className="admin-data-row-actions">
                      <button
                        type="button"
                        className="admin-data-edit-button"
                        onClick={() => openEditForm(record)}
                        title="Edit record"
                      >
                        Edit
                      </button>

                      {Object.prototype.hasOwnProperty.call(
                        record,
                        "status"
                      ) && (
                        <button
                          type="button"
                          className="admin-data-status-button"
                          onClick={() => handleStatusChange(record)}
                          title="Toggle active status"
                        >
                          {String(record.status).toLowerCase() === "active"
                            ? "Pause"
                            : "Activate"}
                        </button>
                      )}

                      <button
                        type="button"
                        className="admin-data-delete-button"
                        onClick={() => handleDelete(record)}
                        title="Delete record"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="admin-data-empty"
                  >
                    <span className="admin-data-empty-icon">⌕</span>
                    <strong>No records found</strong>
                    <p>Try changing your search or filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-data-table-footer">
          Showing {filteredRecords.length} of {records.length} records
        </div>
      </div>

      {showForm && (
        <div
          className="admin-data-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div
            className="admin-data-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-data-modal-title"
          >
            <div className="admin-data-modal-heading">
              <div>
                <h2 id="admin-data-modal-title">
                  {editingId !== null
                    ? `Edit ${singularLabel}`
                    : `Add ${singularLabel}`}
                </h2>

                <p>Enter the details below.</p>
              </div>

              <button
                type="button"
                className="admin-data-modal-close"
                onClick={closeForm}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-data-form-grid">
                {fields.map((field) => (
                  <div
                    className={`admin-data-form-field ${
                      field.fullWidth ? "full-width" : ""
                    }`}
                    key={field.name}
                  >
                    <label htmlFor={`admin-field-${field.name}`}>
                      {field.label}

                      {field.required && (
                        <span className="admin-data-required"> *</span>
                      )}
                    </label>

                    {field.type === "select" ? (
                      <select
                        id={`admin-field-${field.name}`}
                        name={field.name}
                        value={formData[field.name] ?? ""}
                        onChange={handleInputChange}
                        required={Boolean(field.required)}
                      >
                        <option value="">Select {field.label}</option>

                        {(field.options || []).map((option) => {
                          const optionValue =
                            typeof option === "string"
                              ? option
                              : option.value;

                          const optionLabel =
                            typeof option === "string"
                              ? option
                              : option.label;

                          return (
                            <option
                              key={optionValue}
                              value={optionValue}
                            >
                              {optionLabel}
                            </option>
                          );
                        })}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        id={`admin-field-${field.name}`}
                        name={field.name}
                        value={formData[field.name] ?? ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || ""}
                        required={Boolean(field.required)}
                        rows={4}
                      />
                    ) : (
                      <input
                        id={`admin-field-${field.name}`}
                        name={field.name}
                        type={field.type || "text"}
                        value={formData[field.name] ?? ""}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || ""}
                        required={Boolean(field.required)}
                        min={field.min}
                        step={field.step}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="admin-data-form-actions">
                <button
                  type="button"
                  className="admin-data-cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {editingId !== null ? "Save Changes" : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Admin_DataPage;