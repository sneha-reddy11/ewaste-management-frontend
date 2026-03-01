import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaLeaf,
  FaCheckCircle,
  FaTruck,
  FaChevronLeft,
  FaEdit,
  FaShieldAlt,
  FaLock,
  FaUserCog
} from "react-icons/fa";
import { apiRequest } from "../api.js";

const PHONE_REGEX = /^[6-9]\d{9}$/;

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiRequest("/users/me");
      setProfile(data);
      setForm({ name: data.name || "", phone: data.phone || "" });
    } catch (err) {
      setError("Failed to load profile");
    }
  };

  const profileInitials =
      profile?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const startProfileEdit = () => {
    setIsEditingProfile(true);
    setError("");
    setStatus("");
  };

  const cancelProfileEdit = () => {
    setIsEditingProfile(false);
    setForm({ name: profile.name, phone: profile.phone });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.phone && !PHONE_REGEX.test(form.phone)) {
      setError("Invalid phone number");
      return;
    }

    try {
      await apiRequest("/users/me", "PUT", form);
      setStatus("Profile updated successfully");
      setIsEditingProfile(false);
      fetchProfile();
    } catch {
      setError("Failed to update profile");
    }
  };

  const startPasswordChange = () => {
    setIsChangingPassword(true);
    setError("");
    setPasswordStatus("");
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await apiRequest("/users/change-password", "POST", passwordForm);
      setPasswordStatus("Password updated successfully");
      cancelPasswordChange();
    } catch {
      setError("Failed to change password");
    }
  };

  return (
      <div className="profile-page">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <button onClick={() => navigate("/dashboard")}>
            <FaChevronLeft /> Dashboard
          </button>
        </div>

        <div className="profile-grid">

          {/* Personal Info */}
          <div className="profile-card">
            <h2><FaUserCog /> Personal Details</h2>

            {!profile ? (
                <p>Loading...</p>
            ) : !isEditingProfile ? (
                <>
                  <p><strong>Name:</strong> {profile.name}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phone || "Not linked"}</p>

                  <button onClick={startProfileEdit}>
                    <FaEdit /> Edit Profile
                  </button>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                  <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                  />

                  <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                  />

                  <button type="submit">Save</button>
                  <button type="button" onClick={cancelProfileEdit}>
                    Cancel
                  </button>
                </form>
            )}

            {error && <p className="error">{error}</p>}
            {status && <p className="success">{status}</p>}
          </div>

          {/* Security */}
          <div className="profile-card">
            <h2><FaLock /> Security</h2>

            {!isChangingPassword ? (
                <button onClick={startPasswordChange}>
                  Change Password
                </button>
            ) : (
                <form onSubmit={changePassword}>
                  <input
                      type={showOld ? "text" : "password"}
                      name="oldPassword"
                      placeholder="Current Password"
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordChange}
                      required
                  />

                  <input
                      type={showNew ? "text" : "password"}
                      name="newPassword"
                      placeholder="New Password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                  />

                  <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                  />

                  <button type="submit">Update</button>
                  <button type="button" onClick={cancelPasswordChange}>
                    Cancel
                  </button>
                </form>
            )}

            {passwordStatus && <p className="success">{passwordStatus}</p>}
          </div>
        </div>
      </div>
  );
}