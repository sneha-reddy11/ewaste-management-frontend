import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your personal information and account security</p>

        <Link to="/dashboard" className="profile-btn back">
          Back to Dashboard
        </Link>
      </div>

      {/* Content Grid */}
      <div className="profile-grid">

        {/* Profile Info Card */}
        <div className="profile-card">
          <h2>Personal Information</h2>

          <div className="profile-field">
            <label>Name</label>
            <input type="text" value="Swetha" readOnly />
          </div>

          <div className="profile-field">
            <label>Email</label>
            <input type="email" value="swetha@yopmail.com" readOnly />
          </div>

          <div className="profile-field">
            <label>Phone</label>
            <input type="text" value="9876543210" readOnly />
          </div>

          <button className="profile-btn primary">
            Edit Profile
          </button>
        </div>

        {/* Security Card */}
        <div className="profile-card">
          <h2>Security</h2>
          <p>Update your account password to keep it secure.</p>

          {/* IMPORTANT FIX HERE */}
          <Link to="/reset-password" className="profile-btn primary">
            Change Password
          </Link>
        </div>

      </div>
    </div>
  );
}