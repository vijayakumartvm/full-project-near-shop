
import React, { useEffect, useState } from "react";
import {
  Store,
  UserRound,
  Bell,
  ShieldCheck,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ImagePlus,
} from "lucide-react";
import "./Admin_Settings.css";

const DEFAULT_SETTINGS = {
  shopName: "NearShop Marketplace",
  supportEmail: "support@nearshop.com",
  supportPhone: "+91 98765 43210",
  address: "Thiruvannamalai, Tamil Nadu, India",
  adminName: "Administrator",
  adminEmail: "admin@nearshop.com",
  emailNotifications: true,
  orderNotifications: true,
  sellerNotifications: true,
  paymentNotifications: true,
  weeklyReports: false,
  twoFactorReminder: true,
};

export default function Admin_Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState("general");
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nearshopAdminSettings");
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } else {
        setSettings((previous) => ({
          ...previous,
          adminName:
            localStorage.getItem("adminName") || previous.adminName,
        }));
      }
    } catch {
      setNotice({
        type: "error",
        text: "Saved settings could not be loaded. Default settings are shown.",
      });
    }
  }, []);

  const updateSetting = (field, value) => {
    setSettings((previous) => ({ ...previous, [field]: value }));
    setNotice(null);
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!settings.shopName.trim()) {
      setNotice({ type: "error", text: "Please enter a marketplace name." });
      return;
    }

    if (!settings.adminName.trim() || !settings.adminEmail.trim()) {
      setNotice({
        type: "error",
        text: "Please enter the admin name and email address.",
      });
      return;
    }

    setSaving(true);

    try {
      localStorage.setItem("nearshopAdminSettings", JSON.stringify(settings));
      localStorage.setItem("adminName", settings.adminName.trim());

      setNotice({
        type: "success",
        text: "Settings saved in this browser successfully.",
      });
    } catch {
      setNotice({
        type: "error",
        text: "Unable to save settings. Check your browser storage.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);

    try {
      localStorage.setItem(
        "nearshopAdminSettings",
        JSON.stringify(DEFAULT_SETTINGS)
      );
      localStorage.setItem("adminName", DEFAULT_SETTINGS.adminName);
      setNotice({
        type: "success",
        text: "Settings have been reset to the demo defaults.",
      });
    } catch {
      setNotice({
        type: "error",
        text: "Could not reset settings in browser storage.",
      });
    }
  };

  const updatePasswordField = (field, value) => {
    setPasswords((previous) => ({ ...previous, [field]: value }));
    setPasswordMessage("");
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPasswordMessage("Please complete all three password fields.");
      return;
    }

    if (passwords.next.length < 8) {
      setPasswordMessage("The new password must contain at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(passwords.next) || !/[a-z]/.test(passwords.next)) {
      setPasswordMessage(
        "Use at least one uppercase and one lowercase letter in the new password."
      );
      return;
    }

    if (!/[0-9]/.test(passwords.next)) {
      setPasswordMessage("Add at least one number to the new password.");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setPasswordMessage("The new password and confirmation do not match.");
      return;
    }

    setPasswordMessage(
      "The form passed local validation. Connect your backend authentication API to change the real password."
    );
  };

  const tabs = [
    { id: "general", label: "Marketplace", icon: Store },
    { id: "profile", label: "Admin Profile", icon: UserRound },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <section className="aset-page">
      <div className="aset-heading">
        <div>
          <span className="aset-eyebrow">CONFIGURATION</span>
          <h1>Admin Settings</h1>
          <p>Manage your marketplace, profile, notifications, and security.</p>
        </div>

        <button
          type="button"
          className="aset-reset-button"
          onClick={handleReset}
        >
          <RotateCcw size={16} />
          Reset defaults
        </button>
      </div>

      {notice && (
        <div className={`aset-alert ${notice.type}`} role="status">
          {notice.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{notice.text}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      <div className="aset-layout">
        <aside className="aset-navigation">
          <div className="aset-nav-heading">SETTINGS MENU</div>

          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              className={`aset-nav-item ${
                activeTab === id ? "active" : ""
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
              <span className="aset-nav-arrow">›</span>
            </button>
          ))}

          <div className="aset-help-card">
            <div className="aset-help-icon">
              <ShieldCheck size={21} />
            </div>
            <strong>Keep your account safe</strong>
            <p>Use a strong password and connect server-side authentication.</p>
          </div>
        </aside>

        <main className="aset-content">
          {activeTab === "general" && (
            <form onSubmit={handleSave}>
              <div className="aset-content-heading">
                <div className="aset-heading-icon green">
                  <Store size={21} />
                </div>
                <div>
                  <h2>Marketplace settings</h2>
                  <p>Manage the public-facing details of NearShop.</p>
                </div>
              </div>

              <div className="aset-brand-preview">
                <div className="aset-brand-symbol">
                  <Store size={26} />
                </div>
                <div className="aset-brand-info">
                  <strong>{settings.shopName || "Your marketplace name"}</strong>
                  <span>Marketplace branding preview</span>
                </div>
                <span className="aset-active-pill">Marketplace</span>
              </div>

              <div className="aset-form-grid">
                <label className="aset-field full">
                  Marketplace name
                  <input
                    type="text"
                    value={settings.shopName}
                    onChange={(event) =>
                      updateSetting("shopName", event.target.value)
                    }
                    placeholder="Enter marketplace name"
                    required
                  />
                </label>

                <label className="aset-field">
                  Support email
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(event) =>
                      updateSetting("supportEmail", event.target.value)
                    }
                    placeholder="support@example.com"
                  />
                </label>

                <label className="aset-field">
                  Support phone
                  <input
                    type="tel"
                    value={settings.supportPhone}
                    onChange={(event) =>
                      updateSetting("supportPhone", event.target.value)
                    }
                    placeholder="+91 98765 43210"
                  />
                </label>

                <label className="aset-field full">
                  Business address
                  <textarea
                    rows="3"
                    value={settings.address}
                    onChange={(event) =>
                      updateSetting("address", event.target.value)
                    }
                    placeholder="Enter business address"
                  />
                </label>
              </div>

              <div className="aset-info-message">
                <ImagePlus size={18} />
                <div>
                  <strong>Marketplace logo</strong>
                  <p>
                    Your current admin logo remains unchanged. Logo uploading
                    and updating the shared site branding need additional
                    asset handling and backend or storage integration.
                  </p>
                </div>
              </div>

              <div className="aset-form-actions">
                <button type="submit" className="aset-save-button" disabled={saving}>
                  <Save size={17} />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "profile" && (
            <form onSubmit={handleSave}>
              <div className="aset-content-heading">
                <div className="aset-heading-icon blue">
                  <UserRound size={21} />
                </div>
                <div>
                  <h2>Admin profile</h2>
                  <p>Update your profile information for this demo panel.</p>
                </div>
              </div>

              <div className="aset-profile-banner">
                <div className="aset-avatar">
                  {(settings.adminName || "A").trim().charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{settings.adminName || "Administrator"}</strong>
                  <span>Marketplace Administrator</span>
                </div>
                <span className="aset-active-pill">Admin</span>
              </div>

              <div className="aset-form-grid">
                <label className="aset-field full">
                  Full name
                  <input
                    type="text"
                    value={settings.adminName}
                    onChange={(event) =>
                      updateSetting("adminName", event.target.value)
                    }
                    placeholder="Enter admin name"
                    required
                  />
                </label>

                <label className="aset-field full">
                  Admin email
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(event) =>
                      updateSetting("adminEmail", event.target.value)
                    }
                    placeholder="admin@example.com"
                    required
                  />
                </label>
              </div>

              <div className="aset-info-message">
                <AlertCircle size={18} />
                <div>
                  <strong>Account login information</strong>
                  <p>
                    Saving the email here only updates this browser's settings.
                    It does not change the email registered with your
                    authentication system.
                  </p>
                </div>
              </div>

              <div className="aset-form-actions">
                <button type="submit" className="aset-save-button" disabled={saving}>
                  <Save size={17} />
                  {saving ? "Saving..." : "Save profile"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <form onSubmit={handleSave}>
              <div className="aset-content-heading">
                <div className="aset-heading-icon orange">
                  <Bell size={21} />
                </div>
                <div>
                  <h2>Notification preferences</h2>
                  <p>Choose which notification preferences to save.</p>
                </div>
              </div>

              <div className="aset-notification-list">
                {[
                  {
                    field: "emailNotifications",
                    title: "Email notifications",
                    description: "General account and marketplace updates.",
                  },
                  {
                    field: "orderNotifications",
                    title: "Order updates",
                    description: "Notifications about new and updated orders.",
                  },
                  {
                    field: "sellerNotifications",
                    title: "Seller applications",
                    description: "Updates about seller registration and approvals.",
                  },
                  {
                    field: "paymentNotifications",
                    title: "Payment updates",
                    description: "Notifications about payment records and refunds.",
                  },
                  {
                    field: "weeklyReports",
                    title: "Weekly reports",
                    description: "Preference for weekly business report summaries.",
                  },
                  {
                    field: "twoFactorReminder",
                    title: "Security reminders",
                    description: "Preference for security and account reminders.",
                  },
                ].map((item) => (
                  <label className="aset-toggle-row" key={item.field}>
                    <span className="aset-toggle-copy">
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(settings[item.field])}
                      onChange={(event) =>
                        updateSetting(item.field, event.target.checked)
                      }
                    />
                    <span className="aset-toggle-ui" />
                  </label>
                ))}
              </div>

              <div className="aset-info-message">
                <Bell size={18} />
                <div>
                  <strong>Preferences only</strong>
                  <p>
                    These switches store your preferences in the browser.
                    Emails, push notifications, and scheduled reports are not
                    sent until those services are implemented.
                  </p>
                </div>
              </div>

              <div className="aset-form-actions">
                <button type="submit" className="aset-save-button" disabled={saving}>
                  <Save size={17} />
                  {saving ? "Saving..." : "Save preferences"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <div>
              <div className="aset-content-heading">
                <div className="aset-heading-icon purple">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <h2>Security settings</h2>
                  <p>Review password practices and account protection.</p>
                </div>
              </div>

              <div className="aset-security-status">
                <div className="aset-security-status-icon">
                  <ShieldCheck size={23} />
                </div>
                <div>
                  <strong>Backend verification required</strong>
                  <p>
                    Password changes and two-factor authentication must be
                    verified securely by the backend.
                  </p>
                </div>
              </div>

              <form className="aset-password-form" onSubmit={handlePasswordSubmit}>
                <h3>Change password</h3>
                <p className="aset-password-intro">
                  The form below validates your entries locally. It does not
                  change your actual login password.
                </p>

                <label className="aset-field">
                  Current password
                  <div className="aset-password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwords.current}
                      onChange={(event) =>
                        updatePasswordField("current", event.target.value)
                      }
                      autoComplete="current-password"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide passwords" : "Show passwords"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                <label className="aset-field">
                  New password
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwords.next}
                    onChange={(event) =>
                      updatePasswordField("next", event.target.value)
                    }
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                  />
                </label>

                <label className="aset-field">
                  Confirm new password
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(event) =>
                      updatePasswordField("confirm", event.target.value)
                    }
                    autoComplete="new-password"
                    placeholder="Re-enter new password"
                  />
                </label>

                {passwordMessage && (
                  <div className="aset-password-message" role="status">
                    {passwordMessage}
                  </div>
                )}

                <button type="submit" className="aset-save-button">
                  <ShieldCheck size={17} />
                  Validate password form
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      <div className="aset-page-footnote">
        <ShieldCheck size={16} />
        <span>
          Demo settings are stored in the current browser only. Production
          credentials must be managed by your backend.
        </span>
      </div>
    </section>
  );
}
