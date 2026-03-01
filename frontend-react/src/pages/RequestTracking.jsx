import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  FaChevronLeft, 
  FaCheck, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaStickyNote, 
  FaInfoCircle,
  FaImage,
  FaCompass,
  FaTag,
  FaHashtag
} from "react-icons/fa";
import { apiRequest } from "../api.js";

const STATUS_STEPS = ["SUBMITTED", "PICKUP_SCHEDULED", "PICKED_UP", "RECYCLED"];
const STATUS_LABELS = {
  SUBMITTED: "Submitted",
  PICKUP_SCHEDULED: "Scheduled",
  PICKED_UP: "Picked Up",
  RECYCLED: "Recycled",
  REJECTED: "Rejected",
  OTHER: "Other"
};
const STEP_DETAILS = {
  SUBMITTED: "Your request has been received and is awaiting review.",
  PICKUP_SCHEDULED: "A pickup partner has been assigned to collect your items.",
  PICKED_UP: "The items have been collected and are en route to our facility.",
  RECYCLED: "Processing is complete. Thank you for recycling!",
  REJECTED: "Unfortunately, this request could not be processed.",
  OTHER: "The request status has been updated."
};

export default function RequestTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const summary = await apiRequest(`/requests/${id}`, { headers });
        if (!summary) throw new Error("Request details not found.");
        setRequestData(summary);

        try {
          const imagePayload = await apiRequest(`/requests/${id}/image-data`, { headers });
          if (imagePayload?.base64Data) {
            const contentType = imagePayload.contentType || "image/jpeg";
            setImageUrl(`data:${contentType};base64,${imagePayload.base64Data}`);
          }
        } catch (imgErr) {
          console.warn("Could not load request image:", imgErr);
          setImageUrl("");
        }
      } catch (err) {
        console.error("Tracking load error:", err);
        setError(err.message || "Failed to load tracking information.");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const readableStatus = (status) => STATUS_LABELS[status] || STATUS_LABELS.OTHER;

  const statusClassName = (status) => {
    switch (status) {
      case "RECYCLED": return "status-badge status-recycled";
      case "REJECTED": return "status-badge status-rejected";
      case "PICKED_UP": return "status-badge status-picked";
      case "PICKUP_SCHEDULED": return "status-badge status-scheduled";
      default: return "status-badge status-submitted";
    }
  };

  const steps = useMemo(() => {
    if (!requestData?.status) return STATUS_STEPS;
    if (requestData.status === "REJECTED") return ["SUBMITTED", "PICKUP_SCHEDULED", "PICKED_UP", "REJECTED"];
    return STATUS_STEPS;
  }, [requestData]);

  const getStepState = (stepIndex) => {
    if (!requestData?.status) return "pending";
    const currentIndex = steps.indexOf(requestData.status);
    if (currentIndex > stepIndex) return "done";
    if (currentIndex === stepIndex) return "active";
    return "pending";
  };

  if (loading) return (
    <div className="page-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="loading" style={{ fontSize: '20px', color: 'var(--ink-1)', fontWeight: '600' }}>Syncing tracking data...</div>
    </div>
  );

  if (error) return (
    <div className="page-shell" style={{ padding: '40px 24px' }}>
      <div className="content-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <FaInfoCircle size={48} color="#dc2626" style={{ marginBottom: '20px' }} />
        <h2 style={{ color: 'var(--ink-1)' }}>Tracking Error</h2>
        <p style={{ color: 'var(--ink-2)', marginBottom: '32px' }}>{error}</p>
        <button className="btn pin-btn-primary" onClick={() => navigate("/requests/view")}>Back to Requests</button>
      </div>
    </div>
  );

  if (!requestData) return (
    <div className="page-shell" style={{ padding: '40px 24px' }}>
      <div className="content-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <FaInfoCircle size={48} color="var(--ink-2)" style={{ marginBottom: '20px' }} />
        <h2 style={{ color: 'var(--ink-1)' }}>No Data Available</h2>
        <p style={{ color: 'var(--ink-2)', marginBottom: '32px' }}>We couldn't retrieve the tracking details for this request.</p>
        <button className="btn pin-btn-primary" onClick={() => navigate("/requests/view")}>Back to Requests</button>
      </div>
    </div>
  );

  return (
    <div className="page-shell" style={{ display: 'block', padding: '40px 24px', minHeight: '100vh' }}>
      
      {/* Header */}
      <header style={{ maxWidth: '1120px', margin: '0 auto 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div className="pin-pill" style={{ background: 'rgba(14, 165, 164, 0.2)', color: 'var(--accent-1)', fontWeight: '700' }}>Live Tracking</div>
          <h1 className="page-title" style={{ fontSize: '36px', margin: '8px 0', color: 'var(--ink-1)', fontWeight: '800' }}>Track Your Request</h1>
          <p className="page-subtitle" style={{ color: 'var(--ink-2)' }}>Monitor the recycling journey of your electronics</p>
        </div>
        <button className="btn pin-btn-ghost" onClick={() => navigate("/requests/view")}>
          <FaChevronLeft style={{ marginRight: '8px' }} /> Back to Records
        </button>
      </header>

      <main style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        
        {/* Left Column: Request Details Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <article className="content-card" style={{ padding: '32px', borderRadius: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
            
            {/* Header Area: Side-by-side image and title */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '20px', 
                background: 'rgba(148, 163, 184, 0.05)', 
                overflow: 'hidden', 
                display: 'grid', 
                placeItems: 'center', 
                border: '1px solid var(--border)', 
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}>
                {imageUrl ? (
                  <img src={imageUrl} alt="Request" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <FaImage size={40} color="var(--ink-2)" style={{ opacity: 0.5 }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-1)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{requestData.deviceType}</div>
                <h2 style={{ fontSize: '24px', margin: '0 0 12px', color: 'var(--ink-1)', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif' }}>{requestData.brand} {requestData.model}</h2>
                <span className={statusClassName(requestData.status)} style={{ padding: '6px 16px', borderRadius: '99px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {readableStatus(requestData.status)}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(148, 163, 184, 0.05)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--ink-2)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><FaTag /> CONDITION</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink-1)' }}>{requestData.condition}</div>
              </div>
              <div style={{ background: 'rgba(148, 163, 184, 0.05)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--ink-2)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><FaHashtag /> QUANTITY</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink-1)' }}>{requestData.quantity} Units</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  <FaMapMarkerAlt color="var(--accent-1)" /> PICKUP LOCATION
                </div>
                <p style={{ fontSize: '14px', color: 'var(--ink-1)', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>{requestData.pickupAddress}</p>
              </div>
              {requestData.additionalRemarks && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    <FaStickyNote color="var(--accent-1)" /> ADDITIONAL NOTES
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--ink-1)', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>{requestData.additionalRemarks}</p>
                </div>
              )}
            </div>
          </article>

          <article className="content-card" style={{ padding: '24px 32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ink-2)', fontSize: '13px', fontWeight: '600' }}>
                  <FaCalendarAlt size={14} color="var(--accent-1)" /> Created On
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ink-1)', fontWeight: '700' }}>{new Date(requestData.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ink-2)', fontSize: '13px', fontWeight: '600' }}>
                  <FaClock size={14} color="var(--accent-1)" /> Last Update
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ink-1)', fontWeight: '700' }}>{new Date(requestData.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </article>
        </div>

        {/* Right Column: Timeline Tracking Card */}
        <article className="content-card" style={{ padding: '40px', borderRadius: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
          <h3 style={{ fontSize: '22px', color: 'var(--ink-1)', fontWeight: '800', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaCompass color="var(--accent-1)" /> Recycling Journey
          </h3>

          <div style={{ display: 'grid', gap: '0' }}>
            {steps.map((step, index) => {
              const stepState = getStepState(index);
              const isActive = stepState === "active";
              const isDone = stepState === "done";
              
              return (
                <div key={step} style={{ display: 'flex', gap: '24px', minHeight: '100px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      display: 'grid', 
                      placeItems: 'center',
                      background: isDone ? '#10b981' : isActive ? 'var(--accent-1)' : 'rgba(148, 163, 184, 0.1)',
                      color: isDone || isActive ? '#fff' : 'var(--ink-2)',
                      border: isActive ? '4px solid rgba(14, 165, 164, 0.2)' : 'none',
                      transition: 'all 0.3s ease',
                      zIndex: 2
                    }}>
                      {isDone ? <FaCheck size={14} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />}
                    </div>
                    {index < steps.length - 1 && (
                      <div style={{ 
                        flex: 1, 
                        width: '2px', 
                        background: isDone ? '#10b981' : 'var(--border)',
                        margin: '4px 0',
                        zIndex: 1
                      }} />
                    )}
                  </div>
                  
                  <div style={{ paddingBottom: '40px', opacity: stepState === 'pending' ? 0.5 : 1 }}>
                    <h4 style={{ 
                      fontSize: '18px', 
                      margin: '0 0 6px', 
                      color: isActive ? 'var(--accent-1)' : 'var(--ink-1)', 
                      fontWeight: isActive || isDone ? '800' : '600' 
                    }}>
                      {readableStatus(step)}
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--ink-2)', margin: 0, lineHeight: '1.5' }}>
                      {STEP_DETAILS[step] || STEP_DETAILS.OTHER}
                    </p>
                    {isActive && (
                      <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-1)', fontWeight: '700', padding: '4px 12px', background: 'rgba(14, 165, 164, 0.1)', borderRadius: '20px' }}>
                        <FaClock size={10} /> Current Stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', padding: '24px', background: 'rgba(14, 165, 164, 0.05)', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '12px', color: 'var(--accent-2)' }}>
              <FaInfoCircle style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '4px' }}>Disposal Update</div>
                <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5', opacity: 0.9 }}>
                  Our team follows strict environmental protocols for every device. You'll receive a confirmation certificate once the recycling is complete.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>

    </div>
  );
}
