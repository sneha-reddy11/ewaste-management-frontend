import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
      <div className="eco-dashboard">

        {/* NAVBAR */}
        <header className="eco-navbar">
          <div className="eco-logo">🌿 EcoCircuit</div>

          <div className="eco-nav-buttons">
            <Link to="/requests/submit" className="eco-btn primary">
              Submit
            </Link>

            <Link to="/requests/view" className="eco-btn outline">
              Requests
            </Link>

            <Link to="/profile/me" className="eco-btn outline">
              Profile
            </Link>

            <button onClick={handleLogout} className="eco-btn danger">
              Logout
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="eco-hero">
          <h1>Smart E-Waste Recycling Made Simple</h1>
          <p>
            Responsible disposal. Transparent tracking.
            Sustainable impact for a greener tomorrow.
          </p>

          <Link to="/requests/submit" className="eco-btn hero">
            Schedule Pickup
          </Link>
        </section>

        {/* FEATURE CARDS */}
        <section className="eco-card-grid">

          <div className="eco-card">
            <div className="eco-icon">🚚</div>
            <h3>Doorstep Pickup</h3>
            <p>Schedule device collection quickly and easily.</p>
            <Link to="/requests/submit">Create Request →</Link>
          </div>

          <div className="eco-card">
            <div className="eco-icon">📍</div>
            <h3>Live Tracking</h3>
            <p>Track your recycling request in real time.</p>
            <Link to="/requests/view">View Status →</Link>
          </div>

          <div className="eco-card">
            <div className="eco-icon">🔐</div>
            <h3>Secure Profile</h3>
            <p>Manage your account and personal information.</p>
            <Link to="/profile/me">Manage →</Link>
          </div>

        </section>
      </div>
  );
}