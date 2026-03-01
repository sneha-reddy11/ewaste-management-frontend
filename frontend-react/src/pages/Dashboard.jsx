import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home-shell pin-dashboard-shell">
      
      {/* Header Section */}
      <header className="home-header pin-dashboard-header">
        <div className="brand">
          <div className="brand-mark">EW</div>
          <div>
            <div className="brand-name">E-Waste Management</div>
            <div className="brand-tag">Sustainable disposal made simple</div>
          </div>
        </div>

        <div className="home-header-actions" style={{ display: 'flex', gap: '12px' }}>
          <Link to="/requests/submit" className="btn pin-btn-primary">
            Submit Request
          </Link>
          <Link to="/requests/view" className="btn pin-btn-ghost">
            View Requests
          </Link>
          <Link to="/profile/me" className="btn pin-btn-ghost">
            Profile
          </Link>
          <button className="btn pin-btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pin-hero-card" style={{ width: '100%', maxWidth: '1120px', margin: '0 auto 32px' }}>
        <h1 style={{ fontSize: '42px', marginBottom: '16px', fontWeight: '800' }}>
          Responsible Disposal, <span style={{ color: 'var(--accent-1)' }}>Lasting Legacy</span>
        </h1>
        <p style={{ color: 'var(--ink-2)', lineHeight: '1.6', marginBottom: '28px', maxWidth: '800px' }}>
          Transform your environmental impact. Seamlessly submit electronics for responsible recycling, track every step of the journey, and join thousands making sustainable choices. Your waste management, powered by transparency and accountability.
        </p>
        <div className="pin-hero-actions" style={{ display: 'flex', gap: '16px' }}>
          <Link to="/requests/submit" className="btn pin-btn-primary">
            Create Pickup
          </Link>
          <Link to="/requests/view" className="btn pin-btn-ghost">
            Open Requests
          </Link>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="pin-board-grid" style={{ 
        width: '100%', 
        maxWidth: '1120px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px' 
      }}>
        
        <article className="pin-card pin-card-olive" style={{ padding: '32px', borderRadius: '24px' }}>
          <div className="pin-card-kicker">Doorstep Pickup</div>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Share details once, we handle the route.</h3>
          <p style={{ marginBottom: '24px' }}>Add device info, pickup location, and preferred notes in a guided flow.</p>
          <Link to="/requests/submit" className="pin-card-link" style={{ fontWeight: '700', textDecoration: 'none', color: 'var(--accent-1)' }}>
            Start submission →
          </Link>
        </article>

        <article className="pin-card pin-card-cream" style={{ padding: '32px', borderRadius: '24px' }}>
          <div className="pin-card-kicker">Live Status</div>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Submitted to recycled.</h3>
          <p style={{ marginBottom: '24px' }}>Follow every request stage with a clear timeline view.</p>
          <Link to="/requests/view" className="pin-card-link" style={{ fontWeight: '700', textDecoration: 'none', color: 'var(--accent-1)' }}>
            View all requests →
          </Link>
        </article>

        <article className="pin-card pin-card-rose" style={{ padding: '32px', borderRadius: '24px' }}>
          <div className="pin-card-kicker">Profile Ready</div>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Keep contact details updated.</h3>
          <p style={{ marginBottom: '24px' }}>Accurate profile data helps pickup teams reach you faster.</p>
          <Link to="/profile/me" className="pin-card-link" style={{ fontWeight: '700', textDecoration: 'none', color: 'var(--accent-1)' }}>
            Update profile →
          </Link>
        </article>

        <article className="pin-card pin-card-white" style={{ padding: '32px', borderRadius: '24px' }}>
          <div className="pin-card-kicker">Quick Tips</div>
          <ul className="pin-list" style={{ marginTop: '12px', display: 'grid', gap: '12px', paddingLeft: '20px' }}>
            <li>Upload a clear device image for faster review.</li>
            <li>Use live location to avoid address mismatches.</li>
            <li>Track status changes from your requests page.</li>
          </ul>
        </article>

        <article className="pin-card pin-card-sky" style={{ padding: '32px', borderRadius: '24px' }}>
          <div className="pin-card-kicker">Recycling Promise</div>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Responsible disposal only.</h3>
          <p>Devices are handled through an eco-conscious process using industry-standard protocols.</p>
        </article>

      </section>
    </div>
  );
}
