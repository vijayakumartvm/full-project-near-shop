
import React, { useState } from "react";
import { CheckCircle2, UserRound, Mail, Phone, ShieldCheck } from "lucide-react";
import "./Admin_Profile.css";

function Admin_Profile() {
  const [name, setName] = useState(
    localStorage.getItem("nearshopAdminName") || "Administrator"
  );
  const [email, setEmail] = useState("admin@nearshop.com");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem("nearshopAdminName", name.trim());
    setSaved(true);
  };

  return (
    <section className="near-admin-profile">
      <div className="near-profile-heading">
        <span>ACCOUNT SETTINGS</span>
        <h2>Admin Profile</h2>
        <p>Manage your NearShop administrator information.</p>
      </div>

      {saved && (
        <div className="near-profile-success" role="status">
          <CheckCircle2 size={18} />
          Profile name saved in this browser.
        </div>
      )}

      <div className="near-profile-grid">
        <aside className="near-profile-card near-profile-summary">
          <div className="near-profile-avatar">
            {name.trim().charAt(0).toUpperCase() || "A"}
          </div>
          <h3>{name || "Administrator"}</h3>
          <p>Super Admin</p>

          <div className="near-profile-security">
            <ShieldCheck size={19} />
            <div>
              <strong>Administrator account</strong>
              <span>NearShop Marketplace</span>
            </div>
          </div>
        </aside>

        <section className="near-profile-card">
          <div className="near-profile-form-heading">
            <div>
              <h3>Personal Information</h3>
              <p>Update your profile details below.</p>
            </div>
            <UserRound size={22} />
          </div>

          <form onSubmit={handleSubmit} className="near-profile-form">
            <div className="near-profile-field">
              <label htmlFor="profile-name">Full Name</label>
              <div className="near-profile-input">
                <UserRound size={18} />
                <input
                  id="profile-name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setSaved(false);
                  }}
                  required
                />
              </div>
            </div>

            <div className="near-profile-field">
              <label htmlFor="profile-email">Email Address</label>
              <div className="near-profile-input">
                <Mail size={18} />
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <small>
                Demo mode: email changes are not sent to the backend.
              </small>
            </div>

            <div className="near-profile-field">
              <label htmlFor="profile-phone">Phone Number</label>
              <div className="near-profile-input">
                <Phone size={18} />
                <input
                  id="profile-phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </div>

            <div className="near-profile-field">
              <label>Role</label>
              <div className="near-profile-role">Super Admin</div>
            </div>

            <button type="submit" className="near-profile-save">
              Save Profile
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}

export default Admin_Profile;
