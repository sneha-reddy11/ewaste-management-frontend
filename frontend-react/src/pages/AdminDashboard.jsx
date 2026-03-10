import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";

const STATUS_OPTIONS = [
  "SUBMITTED",
  "PENDING",
  "ACCEPTED",
  "SCHEDULED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "REJECTED"
];

const STATUS_LABELS = {
  SUBMITTED: "Submitted",
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  SCHEDULED: "Pickup Scheduled",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  PICKED_UP: "Picked Up",
  REJECTED: "Rejected"
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const load = async () => {
      try {
        const me = await apiRequest("/profile/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(me);
        if (me.role !== "ADMIN") {
          setError("Admin access required.");
          setLoading(false);
          return;
        }

        const data = await apiRequest("/admin/requests", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const normalized = Array.isArray(data) ? data : [];
        setRequests(normalized);

        const initialDrafts = {};
        normalized.forEach((req) => {
          initialDrafts[req.id] = {
            status: req.status || "PENDING",
            pickupDate: req.pickupDate || "",
            pickupTime: req.pickupTime || "",
            pickupPersonnelName: req.pickupPersonnelName || ""
          };
        });
        setDrafts(initialDrafts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((req) => {
      if (statusFilter !== "ALL" && req.status !== statusFilter) return false;
      if (!q) return true;
      const text = [
        req.id,
        req.requesterName,
        req.requesterEmail,
        req.deviceType,
        req.brand,
        req.model,
        req.pickupAddress
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }, [requests, query, statusFilter]);

  const metrics = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "PENDING" || r.status === "SUBMITTED").length;
    const scheduled = requests.filter((r) => r.status === "SCHEDULED" || r.status === "PICKUP_SCHEDULED").length;
    const rejected = requests.filter((r) => r.status === "REJECTED").length;
    return { total, pending, scheduled, rejected };
  }, [requests]);

  const statusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
      case "SUBMITTED":
        return "status-badge status-pending";
      case "ACCEPTED":
        return "status-badge status-accepted";
      case "SCHEDULED":
      case "PICKUP_SCHEDULED":
        return "status-badge status-scheduled";
      case "PICKED_UP":
        return "status-badge status-picked";
      case "REJECTED":
        return "status-badge status-rejected";
      default:
        return "status-badge status-other";
    }
  };

  const handleDraftChange = (id, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const saveUpdate = async (id) => {
    const token = localStorage.getItem("token");
    const draft = drafts[id];
    if (!draft) return;

    setError("");
    setSavingId(id);

    try {
      const body = {
        status: draft.status
      };
      if (draft.status === "SCHEDULED") {
        body.pickupDate = draft.pickupDate || null;
        body.pickupTime = draft.pickupTime || null;
        body.pickupPersonnelName = draft.pickupPersonnelName || null;
      }

      const updated = await apiRequest(`/admin/requests/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      setRequests((prev) => prev.map((req) => (req.id === id ? updated : req)));
      setDrafts((prev) => ({
        ...prev,
        [id]: {
          status: updated.status,
          pickupDate: updated.pickupDate || "",
          pickupTime: updated.pickupTime || "",
          pickupPersonnelName: updated.pickupPersonnelName || ""
        }
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="page-shell"><div className="loading">Loading admin dashboard...</div></div>;
  }

  if (profile?.role !== "ADMIN") {
    return (
      <div className="page-shell" style={{ display: "grid", placeItems: "center", minHeight: "70vh" }}>
        <div className="content-card" style={{ maxWidth: 560, textAlign: "center" }}>
          <h2>Access Denied</h2>
          <p>{error || "You are not allowed to view admin tools."}</p>
          <button className="btn pin-btn-primary" onClick={() => navigate("/dashboard")}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell admin-shell">
      <div className="admin-wrap">
        <header className="admin-hero">
          <div>
            <div className="pin-pill admin-pill">Admin Module</div>
            <h1 className="admin-title">Request Management & Scheduling</h1>
            <p className="admin-subtitle">Review incoming requests, update lifecycle status, and assign pickup details.</p>
          </div>
          <div className="admin-hero-actions">
            <Link to="/dashboard" className="btn pin-btn-ghost">User Dashboard</Link>
          </div>
        </header>

        <section className="admin-metrics">
          <article className="admin-metric-card">
            <div className="admin-metric-label">Total Requests</div>
            <div className="admin-metric-value">{metrics.total}</div>
          </article>
          <article className="admin-metric-card">
            <div className="admin-metric-label">Pending Review</div>
            <div className="admin-metric-value">{metrics.pending}</div>
          </article>
          <article className="admin-metric-card">
            <div className="admin-metric-label">Pickup Scheduled</div>
            <div className="admin-metric-value">{metrics.scheduled}</div>
          </article>
          <article className="admin-metric-card">
            <div className="admin-metric-label">Rejected</div>
            <div className="admin-metric-value">{metrics.rejected}</div>
          </article>
        </section>

        {error && <div className="form-error">{error}</div>}

        <section className="admin-filter-card">
          <div className="admin-filter-head">
            <div className="admin-filter-title">Filter Requests</div>
            <div className="admin-filter-summary">{filtered.length} shown</div>
          </div>
          <div className="admin-filter-grid">
            <input
              className="admin-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, user, device, brand, address"
            />
            <select
              className="admin-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="admin-request-list">
          {filtered.map((req) => {
            const draft = drafts[req.id] || {};
            const requiresSchedule = draft.status === "SCHEDULED" || draft.status === "PICKUP_SCHEDULED";
            return (
              <article key={req.id} className="admin-request-card">
                <div className="admin-request-head">
                  <h3 className="admin-request-title">#{req.id} {req.deviceType} - {req.brand} {req.model}</h3>
                  <span className={statusBadgeClass(req.status)}>{STATUS_LABELS[req.status] || req.status}</span>
                </div>

                <div className="admin-request-grid">
                  <div className="admin-request-meta">
                    <div><b>User:</b> {req.requesterName || "N/A"}</div>
                    <div><b>Email:</b> {req.requesterEmail || "N/A"}</div>
                    <div><b>Quantity:</b> {req.quantity || 1}</div>
                    <div><b>Condition:</b> {req.condition || "N/A"}</div>
                    <div><b>Address:</b> {req.pickupAddress || "N/A"}</div>
                  </div>

                  <div className="admin-request-controls">
                    <label className="admin-label">New Status</label>
                    <select
                      className="admin-input"
                      value={draft.status || req.status}
                      onChange={(e) => handleDraftChange(req.id, "status", e.target.value)}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                      ))}
                    </select>

                    <div className="admin-schedule-grid">
                      <div>
                        <label className="admin-label">Pickup Date</label>
                        <input
                          className="admin-input"
                          type="date"
                          value={draft.pickupDate || ""}
                          onChange={(e) => handleDraftChange(req.id, "pickupDate", e.target.value)}
                          disabled={!requiresSchedule}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Pickup Time</label>
                        <input
                          className="admin-input"
                          type="time"
                          value={draft.pickupTime || ""}
                          onChange={(e) => handleDraftChange(req.id, "pickupTime", e.target.value)}
                          disabled={!requiresSchedule}
                        />
                      </div>
                    </div>

                    <label className="admin-label">Pickup Personnel</label>
                    <input
                      className="admin-input"
                      type="text"
                      placeholder="Personnel name"
                      value={draft.pickupPersonnelName || ""}
                      onChange={(e) => handleDraftChange(req.id, "pickupPersonnelName", e.target.value)}
                      disabled={!requiresSchedule}
                    />

                    <button
                      className="btn pin-btn-primary admin-save-btn"
                      onClick={() => saveUpdate(req.id)}
                      disabled={savingId === req.id}
                    >
                      {savingId === req.id ? "Saving..." : "Apply Update"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {filtered.length === 0 && (
            <div className="content-card admin-empty-state">No requests found.</div>
          )}
        </section>
      </div>
    </div>
  );
}
