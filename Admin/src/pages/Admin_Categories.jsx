
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Tags,
  Package,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

import "./Admin_Categories.css";

import vegetablesImage from "../assets/images/categories/fresh-vegetables.jpg";
import fruitsImage from "../assets/images/categories/fresh-fruits.jpg";
import dairyImage from "../assets/images/categories/dairy-eggs.jpg";
import grainsImage from "../assets/images/categories/rice-grains.jpg";
import snacksImage from "../assets/images/categories/snacks.jpg";
import beveragesImage from "../assets/images/categories/beverages.jpg";

const STORAGE_KEY = "nearshopAdminCategories";

const imageOptions = [
  { label: "Fresh Vegetables", value: vegetablesImage, emoji: "🥦" },
  { label: "Fresh Fruits", value: fruitsImage, emoji: "🍎" },
  { label: "Dairy & Eggs", value: dairyImage, emoji: "🥛" },
  { label: "Rice & Grains", value: grainsImage, emoji: "🌾" },
  { label: "Snacks", value: snacksImage, emoji: "🍪" },
  { label: "Beverages", value: beveragesImage, emoji: "🥤" },
];

const defaultCategories = [
  {
    id: 1,
    name: "Fresh Vegetables",
    slug: "fresh-vegetables",
    description: "Fresh vegetables from local grocery sellers.",
    icon: "🥦",
    image: vegetablesImage,
    color: "#e9f8ec",
    products: 42,
    status: "Active",
  },
  {
    id: 2,
    name: "Fresh Fruits",
    slug: "fresh-fruits",
    description: "Seasonal fruits and fresh fruit selections.",
    icon: "🍎",
    image: fruitsImage,
    color: "#fff0e9",
    products: 36,
    status: "Active",
  },
  {
    id: 3,
    name: "Dairy & Eggs",
    slug: "dairy-eggs",
    description: "Milk, curd, cheese, butter and eggs.",
    icon: "🥛",
    image: dairyImage,
    color: "#e9f3ff",
    products: 28,
    status: "Active",
  },
  {
    id: 4,
    name: "Rice & Grains",
    slug: "rice-grains",
    description: "Rice, grains, flour and everyday staples.",
    icon: "🌾",
    image: grainsImage,
    color: "#fff7df",
    products: 31,
    status: "Active",
  },
  {
    id: 5,
    name: "Snacks",
    slug: "snacks",
    description: "Biscuits, chips and packaged snacks.",
    icon: "🍪",
    image: snacksImage,
    color: "#f7eaff",
    products: 24,
    status: "Inactive",
  },
  {
    id: 6,
    name: "Beverages",
    slug: "beverages",
    description: "Juices, bottled drinks, tea and coffee.",
    icon: "🥤",
    image: beveragesImage,
    color: "#e5f8f7",
    products: 19,
    status: "Active",
  },
];

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  icon: "🛒",
  image: vegetablesImage,
  color: "#e9f8ec",
  status: "Active",
};

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getSavedCategories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultCategories;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return defaultCategories;
    }

    return parsed.map((category) => {
      const matchingDefault = defaultCategories.find(
        (item) => item.id === category.id
      );

      // Replace old remote-image URLs with the downloaded local photos.
      const existingImage = imageOptions.some(
        (item) => item.value === category.image
      );

      return {
        ...matchingDefault,
        ...category,
        image: existingImage
          ? category.image
          : matchingDefault?.image || vegetablesImage,
      };
    });
  } catch (error) {
    console.error("Could not load saved categories:", error);
    return defaultCategories;
  }
}

export default function Admin_Categories() {
  const [categories, setCategories] = useState(getSavedCategories);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query) ||
        (category.description || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const activeCount = categories.filter(
    (category) => category.status === "Active"
  ).length;

  const inactiveCount = categories.filter(
    (category) => category.status === "Inactive"
  ).length;

  const productCount = categories.reduce(
    (total, category) => total + Number(category.products || 0),
    0
  );

  function openAddModal() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(category) {
    setEditingId(category.id);

    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "🛒",
      image: category.image || vegetablesImage,
      color: category.color || "#e9f8ec",
      status: category.status || "Active",
    });

    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError("");
  }

  function handleNameChange(value) {
    setForm((previous) => ({
      ...previous,
      name: value,
      slug: editingId ? previous.slug : createSlug(value),
    }));
  }

  function handleImageChange(value) {
    const selectedImage = imageOptions.find(
      (item) => item.value === value
    );

    setForm((previous) => ({
      ...previous,
      image: value,
      icon: selectedImage?.emoji || previous.icon,
      color:
        selectedImage?.label === "Fresh Vegetables"
          ? "#e9f8ec"
          : selectedImage?.label === "Fresh Fruits"
            ? "#fff0e9"
            : selectedImage?.label === "Dairy & Eggs"
              ? "#e9f3ff"
              : selectedImage?.label === "Rice & Grains"
                ? "#fff7df"
                : selectedImage?.label === "Snacks"
                  ? "#f7eaff"
                  : selectedImage?.label === "Beverages"
                    ? "#e5f8f7"
                    : previous.color,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const slug = createSlug(form.slug);

    if (!name) {
      setFormError("Please enter a category name.");
      return;
    }

    const duplicateName = categories.some(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        category.id !== editingId
    );

    if (duplicateName) {
      setFormError("A category with this name already exists.");
      return;
    }

    const duplicateSlug = categories.some(
      (category) =>
        category.slug === slug && category.id !== editingId
    );

    if (!slug) {
      setFormError("Please enter a valid category URL.");
      return;
    }

    if (duplicateSlug) {
      setFormError("This category URL already exists.");
      return;
    }

    const categoryData = {
      ...form,
      name,
      slug,
      image: form.image || vegetablesImage,
    };

    if (editingId !== null) {
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingId
            ? { ...category, ...categoryData }
            : category
        )
      );
    } else {
      setCategories((previous) => [
        {
          id: Date.now(),
          ...categoryData,
          products: 0,
        },
        ...previous,
      ]);
    }

    closeModal();
  }

  function toggleStatus(id) {
    setCategories((previous) =>
      previous.map((category) =>
        category.id === id
          ? {
              ...category,
              status:
                category.status === "Active" ? "Inactive" : "Active",
            }
          : category
      )
    );
  }

  function deleteCategory(category) {
    const confirmed = window.confirm(
      `Delete "${category.name}" from the demo category list?`
    );

    if (!confirmed) return;

    setCategories((previous) =>
      previous.filter((item) => item.id !== category.id)
    );
  }

  function resetDemo() {
    const confirmed = window.confirm(
      "Reset categories to the original six demo categories?"
    );

    if (!confirmed) return;

    setCategories(defaultCategories);
    setSearch("");
    setStatusFilter("All");
  }

  return (
    <div className="acat-page">
      <div className="acat-heading">
        <div>
          <p className="acat-eyebrow">CATALOG MANAGEMENT</p>
          <h1>Categories</h1>
          <p className="acat-subtitle">
            Organize grocery products into clear categories.
          </p>
        </div>

        <div className="acat-heading-actions">
          <button
            className="acat-reset-btn"
            onClick={resetDemo}
            type="button"
          >
            <RefreshCw size={16} />
            Reset demo
          </button>

          <button
            className="acat-primary-btn"
            onClick={openAddModal}
            type="button"
          >
            <Plus size={18} />
            Add category
          </button>
        </div>
      </div>

      <div className="acat-stat-grid">
        <div className="acat-stat-card">
          <div className="acat-stat-icon acat-icon-green">
            <Tags size={21} />
          </div>
          <div>
            <p>Total categories</p>
            <h2>{categories.length}</h2>
            <span>All catalog categories</span>
          </div>
        </div>

        <div className="acat-stat-card">
          <div className="acat-stat-icon acat-icon-blue">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <p>Active categories</p>
            <h2>{activeCount}</h2>
            <span>Currently enabled</span>
          </div>
        </div>

        <div className="acat-stat-card">
          <div className="acat-stat-icon acat-icon-orange">
            <EyeOff size={21} />
          </div>
          <div>
            <p>Inactive categories</p>
            <h2>{inactiveCount}</h2>
            <span>Currently disabled</span>
          </div>
        </div>

        <div className="acat-stat-card">
          <div className="acat-stat-icon acat-icon-purple">
            <Package size={21} />
          </div>
          <div>
            <p>Products in demo</p>
            <h2>{productCount}</h2>
            <span>Across listed categories</span>
          </div>
        </div>
      </div>

      <section className="acat-panel">
        <div className="acat-panel-header">
          <div>
            <h2>All categories</h2>
            <p>Manage the categories shown in your marketplace.</p>
          </div>

          <span className="acat-total-pill">
            {filteredCategories.length} shown
          </span>
        </div>

        <div className="acat-toolbar">
          <div className="acat-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search categories"
            />
          </div>

          <select
            className="acat-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="acat-category-grid">
          {filteredCategories.map((category) => (
            <article className="acat-category-card" key={category.id}>
              <div className="acat-card-top">
                <div
                  className="acat-category-photo"
                  style={{ backgroundColor: category.color }}
                >
                  <span className="acat-category-fallback">
                    {category.icon}
                  </span>

                  <img
                    src={category.image || vegetablesImage}
                    alt={`${category.name} groceries`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <span
                  className={`acat-status ${
                    category.status === "Active"
                      ? "acat-status-active"
                      : "acat-status-inactive"
                  }`}
                >
                  <span className="acat-status-dot" />
                  {category.status}
                </span>
              </div>

              <h3>{category.name}</h3>
              <p className="acat-slug">/{category.slug}</p>

              <p className="acat-description">
                {category.description || "No description added."}
              </p>

              <div className="acat-card-products">
                <Package size={17} />
                <span>
                  <strong>{category.products || 0}</strong> products
                </span>
              </div>

              <div className="acat-card-actions">
                <button
                  className="acat-action-btn"
                  type="button"
                  onClick={() => openEditModal(category)}
                  title="Edit category"
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  className="acat-action-btn"
                  type="button"
                  onClick={() => toggleStatus(category.id)}
                  title="Change category status"
                >
                  {category.status === "Active" ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                  {category.status === "Active" ? "Disable" : "Enable"}
                </button>

                <button
                  className="acat-delete-btn"
                  type="button"
                  onClick={() => deleteCategory(category)}
                  title="Delete category"
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}

          {filteredCategories.length === 0 && (
            <div className="acat-empty-state">
              <div className="acat-empty-icon">
                <Tags size={28} />
              </div>
              <h3>No categories found</h3>
              <p>Try changing your search or status filter.</p>
              <button
                type="button"
                className="acat-primary-btn"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {modalOpen && (
        <div
          className="acat-modal-backdrop"
          onMouseDown={closeModal}
        >
          <section
            className="acat-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="acat-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="acat-modal-header">
              <div>
                <p className="acat-eyebrow">CATEGORY SETTINGS</p>
                <h2 id="acat-modal-title">
                  {editingId !== null ? "Edit category" : "Add category"}
                </h2>
              </div>

              <button
                className="acat-modal-close"
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form className="acat-form" onSubmit={handleSubmit}>
              <label className="acat-field">
                <span>Category name *</span>
                <input
                  value={form.name}
                  onChange={(event) =>
                    handleNameChange(event.target.value)
                  }
                  placeholder="Example: Organic Groceries"
                  maxLength={60}
                  required
                />
              </label>

              <label className="acat-field">
                <span>Category URL *</span>
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      slug: createSlug(event.target.value),
                    }))
                  }
                  placeholder="organic-groceries"
                  required
                />
                <small>Use a unique URL-friendly category name.</small>
              </label>

              <label className="acat-field">
                <span>Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Write a short category description..."
                  rows={3}
                  maxLength={180}
                />
              </label>

              <label className="acat-field">
                <span>Choose category photo *</span>
                <select
                  value={form.image}
                  onChange={(event) => handleImageChange(event.target.value)}
                  required
                >
                  {imageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="acat-image-preview">
                <img
                  src={form.image}
                  alt="Selected category preview"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div>
                  <ImageIcon size={17} />
                  <span>Selected category image</span>
                </div>
              </div>

              <div className="acat-form-row">
                <label className="acat-field">
                  <span>Category emoji</span>
                  <select
                    value={form.icon}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        icon: event.target.value,
                      }))
                    }
                  >
                    <option value="🛒">🛒 Grocery</option>
                    <option value="🥦">🥦 Vegetables</option>
                    <option value="🍎">🍎 Fruits</option>
                    <option value="🥛">🥛 Dairy</option>
                    <option value="🌾">🌾 Grains</option>
                    <option value="🍞">🍞 Bakery</option>
                    <option value="🍪">🍪 Snacks</option>
                    <option value="🥤">🥤 Beverages</option>
                    <option value="🧼">🧼 Household</option>
                    <option value="🌿">🌿 Organic</option>
                  </select>
                </label>

                <label className="acat-field">
                  <span>Background color</span>
                  <select
                    value={form.color}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        color: event.target.value,
                      }))
                    }
                  >
                    <option value="#e9f8ec">Soft green</option>
                    <option value="#fff0e9">Soft peach</option>
                    <option value="#e9f3ff">Soft blue</option>
                    <option value="#fff7df">Soft yellow</option>
                    <option value="#f7eaff">Soft purple</option>
                    <option value="#e5f8f7">Soft teal</option>
                  </select>
                </label>
              </div>

              <label className="acat-field">
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              {formError && (
                <p className="acat-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="acat-form-actions">
                <button
                  type="button"
                  className="acat-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="acat-primary-btn">
                  {editingId !== null ? "Save changes" : "Create category"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
