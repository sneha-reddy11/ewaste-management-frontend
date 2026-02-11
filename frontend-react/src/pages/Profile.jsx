import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    apiRequest("/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name || "", phone: data.phone || "" });
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
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
          phone: form.phone
        })
      });
      setProfile((prev) => ({
        ...prev,
        name: form.name,
        phone: form.phone
      }));
      setStatus(response.message || "Profile updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <div className="page-title">Profile</div>
          <div className="page-subtitle">Update your name and phone</div>
        </div>
        <button className="btn ghost" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="content-card profile-card">
        {error ? <div className="form-error">{error}</div> : null}
        {status ? <div className="form-success">{status}</div> : null}
        {!profile ? (
          <div className="loading">Loading profile...</div>
        ) : (
          <form className="profile-grid" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input value={profile.email || ""} disabled />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <button className="btn primary" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
