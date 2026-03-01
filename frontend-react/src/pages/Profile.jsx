import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaShieldAlt,
  FaLeaf,
  FaCheckCircle,
  FaTruck,
  FaChevronLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserCog
} from "react-icons/fa";
import { apiRequest } from "../api.js";

const PHONE_REGEX = /^[6-9]\d{9}$/;

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordStatus, setPasswordStatus] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    apiRequest("/profile/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
        .then((data) => {
          setProfile(data);
          setForm({
            name: data.name || "",
            phone: data.phone || ""
          });
        })
        .catch((err) => setError(err.message));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    const phoneValue = form.phone.trim();
    if (phoneValue && !PHONE_REGEX.test(phoneValue)) {
      setError("Enter valid 10-digit phone number");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await apiRequest("/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          phone: phoneValue
        })
      });

      setProfile((prev) => ({
        ...prev,
        name: form.name,
        phone: phoneValue || prev?.phone || ""
      }));
      setStatus(response.message || "Profile updated successfully");
      setIsEditingProfile(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const startProfileEdit = () => {
    setError("");
    setStatus("");
    setIsEditingProfile(true);
  };

  const cancelProfileEdit = () => {
    setError("");
    setStatus("");
    setForm({
      name: profile?.name || "",
      phone: profile?.phone || ""
    });
    setIsEditingProfile(false);
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setPasswordStatus("");
    setError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      setError("Password must be 8+ chars with uppercase, lowercase, number and special character");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await apiRequest("/auth/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      setPasswordStatus(response.message || "Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const startPasswordChange = () => {
    setError("");
    setPasswordStatus("");
    setIsChangingPassword(true);
  };

  const cancelPasswordChange = () => {
    setError("");
    setPasswordStatus("");
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setIsChangingPassword(false);
  };

  const profileInitials = (profile?.name || "User")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
      <div className="page-shell" style={{ display: 'block', padding: '40px 24px', minHeight: '100vh' }}>

        {/* Container to center and match width of other pages */}
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

          {/* Header Section */}
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '48px'
          }}>
            <div>
              <div className="pin-pill" style={{ background: 'rgba(14, 165, 164, 0.2)', color: 'var(--accent-1)', fontWeight: '700' }}>Account Management</div>
              <h1 className="page-title" style={{ fontSize: '42px', margin: '8px 0', fontWeight: '800', color: 'var(--ink-1)' }}>Profile Settings</h1>
              <p className="page-subtitle" style={{ fontSize: '16px', color: 'var(--ink-2)' }}>Update your personal information and security</p>
            </div>
            <button className="btn pin-btn-ghost" onClick={() => navigate("/dashboard")} style={{ padding: '14px 28px', fontSize: '15px' }}>
              <FaChevronLeft style={{ marginRight: '10px' }} /> Dashboard
            </button>
          </header>

          {/* Main Grid for Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}>

            {/* Column 1: Identity Card */}
            <article className="content-card" style={{ textAlign: 'center', padding: '48px 32px', background: 'var(--surface)', borderRadius: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
              <div className="pin-card-kicker" style={{ color: 'var(--accent-1)', fontWeight: '800', letterSpacing: '1px' }}>IDENTITY</div>
              <div className="pin-profile-avatar" style={{ margin: '32px auto', width: '110px', height: '110px', fontSize: '40px', background: 'linear-gradient(135deg, #0f766e, #0ea5a4)', color: 'white', borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: '0 10px 25px rgba(15, 118, 110, 0.25)' }}>
                {profileInitials}
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', marginBottom: '8px', color: 'var(--ink-1)', fontWeight: '800' }}>{profile?.name || "Member"}</h2>
              <p style={{ color: 'var(--ink-2)', marginBottom: '32px', fontSize: '15px' }}>{profile?.email}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
              <span style={{ padding: '8px 16px', borderRadius: '20px', background: 'rgba(45, 212, 191, 0.12)', color: 'var(--accent-1)', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaLeaf size={14} /> Eco Member
              </span>
                <span style={{ padding: '8px 16px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.12)', color: '#0284c7', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaShieldAlt size={14} /> Secure Account
              </span>
              </div>

              <div style={{ textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: '32px', display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', fontWeight: '600', fontSize: '14px' }}>
                  <FaCheckCircle /> <span style={{ color: 'var(--ink-1)' }}>Email Verified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', fontWeight: '600', fontSize: '14px' }}>
                  <FaTruck /> <span style={{ color: 'var(--ink-1)' }}>Recycling Active</span>
                </div>
              </div>
            </article>

            {/* Column 2: Personal Details Card */}
            <article className="content-card" style={{ padding: '40px', background: 'var(--surface)', borderRadius: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
              <div className="pin-card-kicker" style={{ color: 'var(--accent-1)', fontWeight: '800', letterSpacing: '1px', marginBottom: '8px' }}>INFORMATION</div>
              <h3 style={{ fontSize: '24px', marginBottom: '32px', fontFamily: 'Space Grotesk, sans-serif', color: 'var(--ink-1)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaUserCog color="var(--accent-1)" /> Personal Details
              </h3>

              {error && !isChangingPassword && <div className="form-error" style={{ marginBottom: '24px', borderRadius: '12px' }}>{error}</div>}
              {status && <div className="form-success" style={{ marginBottom: '24px', borderRadius: '12px' }}>{status}</div>}

              {!profile ? (
                  <div className="loading">Loading details...</div>
              ) : !isEditingProfile ? (
                  <div style={{ display: 'grid', gap: '28px' }}>
                    <div className="input-group">
                      <label style={{ color: 'var(--ink-2)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                      <div style={{ borderBottom: '2px solid var(--border)', padding: '12px 0', fontSize: '16px', color: 'var(--ink-1)', fontWeight: '600' }}>{profile.name}</div>
                    </div>
                    <div className="input-group">
                      <label style={{ color: 'var(--ink-2)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                      <div style={{ borderBottom: '2px solid var(--border)', padding: '12px 0', fontSize: '16px', color: 'var(--ink-1)', fontWeight: '600' }}>{profile.email}</div>
                    </div>
                    <div className="input-group">
                      <label style={{ color: 'var(--ink-2)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
                      <div style={{ borderBottom: '2px solid var(--border)', padding: '12px 0', fontSize: '16px', color: 'var(--ink-1)', fontWeight: '600' }}>{profile.phone || "Not linked"}</div>
                    </div>
                    <button className="btn pin-btn-primary" style={{ marginTop: '16px', padding: '14px 28px' }} onClick={startProfileEdit}>
                      <FaEdit style={{ marginRight: '10px' }} /> Edit Profile
                    </button>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                    <div className="input-group">
                      <label style={{ color: 'var(--ink-1)', fontWeight: '700' }}>NAME</label>
                      <input name="name" value={form.name} onChange={handleChange} required style={{ background: 'rgba(148, 163, 184, 0.05)', border: '2px solid var(--border)', borderRadius: '12px', padding: '14px' }} />
                    </div>
                    <div className="input-group">
                      <label style={{ color: 'var(--ink-1)', fontWeight: '700' }}>EMAIL (READ-ONLY)</label>
                      <input value={profile.email} disabled style={{ background: 'rgba(148, 163, 184, 0.1)', border: '2px solid var(--border)', borderRadius: '12px', padding: '14px', cursor: 'not-allowed' }} />
                    </div>
                    <div className="input-group">
                      <label style={{ color: 'var(--ink-1)', fontWeight: '700' }}>PHONE</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="10 digits" maxLength={10} style={{ background: 'rgba(148, 163, 184, 0.05)', border: '2px solid var(--border)', borderRadius: '12px', padding: '14px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <button className="btn pin-btn-primary" type="submit" style={{ flex: 1 }}><FaSave style={{ marginRight: '10px' }} /> Save</button>
                      <button className="btn pin-btn-ghost" type="button" style={{ flex: 1, border: 'none', background: 'rgba(148, 163, 184, 0.1)' }} onClick={cancelProfileEdit}>Cancel</button>
                    </div>
                  </form>
              )}
            </article>

            {/* Column 3: Security Card */}
            <article className="content-card" style={{ padding: '40px', background: 'var(--surface)', borderRadius: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
              <div className="pin-card-kicker" style={{ color: 'var(--accent-1)', fontWeight: '800', letterSpacing: '1px', marginBottom: '8px' }}>SECURITY</div>
              <h3 style={{ fontSize: '24px', marginBottom: '16px', fontFamily: 'Space Grotesk, sans-serif', color: 'var(--ink-1)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaLock color="var(--accent-1)" /> Password
              </h3>

              {passwordStatus && <div className="form-success" style={{ marginBottom: '24px', borderRadius: '12px' }}>{passwordStatus}</div>}
              {error && isChangingPassword && <div className="form-error" style={{ marginBottom: '24px', borderRadius: '12px' }}>{error}</div>}

              {!isChangingPassword ? (
                  <div>
                    <p style={{ color: 'var(--ink-2)', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>
                      Ensure your account remains secure by using a strong password. We recommend updating it every few months.
                    </p>
                    <button className="btn pin-btn-primary" style={{ width: '100%', padding: '14px' }} onClick={startPasswordChange}>
                      <FaEdit style={{ marginRight: '10px' }} /> Change Password
                    </button>
                  </div>
              ) : (
                  <form onSubmit={changePassword} style={{ display: 'grid', gap: '20px' }}>
                    <div className="input-group">
                      <label style={{ color: 'var(--ink-1)', fontWeight: '700' }}>CURRENT PASSWORD</label>
                      <div className="password-wrapper">
                        <input type={showOld ? "text" : "password"} name="oldPassword" value={passwordForm.oldPassword} onChange={handlePasswordChange} required style={{ background: 'rgba(148, 163, 184, 0.05)', border: '2px solid var(--border)', borderRadius: '12px', padding: '14px', width: '100%' }} />
                        <button type="button" className="toggle-eye" onClick={() => setShowOld(!showOld)} style={{ color: 'var(--ink-2)' }}>
                          {showOld ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label style={{ color: 'var(--ink-1)', fontWeight: '700' }}>NEW PASSWORD</label>
                      <div className="password-wrapper">
                        <input type={showNew ? "text" : "password"} name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required style={{ background: 'rgba(148, 163, 184, 0.05)', border: '2px solid var(--border)', borderRadius: '12px', padding: '14px', width: '100%' }} />
                        <button type="button" className="toggle-eye" onClick={() => setShowNew(!showNew)} style={{ color: 'var(--ink-2)' }}>
                          {showNew ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label style={{ color: 'var(--ink-1)', fontWeight: '700' }}>CONFIRM PASSWORD</label>
                      <div className="password-wrapper">
                        <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required style={{ background: 'rgba(148, 163, 184, 0.05)', border: '2px solid var(--border)', borderRadius: '12px', padding: '14px', width: '100%' }} />
                        <button type="button" className="toggle-eye" onClick={() => setShowConfirm(!showConfirm)} style={{ color: 'var(--ink-2)' }}>
                          {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
                      <button className="btn pin-btn-primary" type="submit" style={{ padding: '14px' }}>Save New Password</button>
                      <button className="btn pin-btn-ghost" type="button" style={{ border: 'none', background: 'rgba(148, 163, 184, 0.1)' }} onClick={cancelPasswordChange}>Cancel</button>
                    </div>
                  </form>
              )}
            </article>

          </div>
        </div>
      </div>
  );
}
