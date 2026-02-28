import { useState, useRef } from "react";

export default function AuthLayout({ title, subtitle, children, footer }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { top, left, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    const rotateX = (-y / height) * 10; // max 10deg tilt
    const rotateY = (x / width) * 10;
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => setTransform("");

  return (
    <div className="auth-shell">
      <div
        className="auth-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform }}
      >
        <div className="auth-brand">
          <div className="brand-mark">EW</div>
          <div>
            <div className="brand-name">E-Waste Management</div>
          </div>
        </div>
        <div className="auth-head">
          <div className="auth-title">{title}</div>
          {subtitle ? <div className="auth-subtitle">{subtitle}</div> : null}
        </div>
        {children}
        {footer ? <div className="auth-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
