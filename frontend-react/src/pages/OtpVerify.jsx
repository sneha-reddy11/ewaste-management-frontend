import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { apiRequest } from "../api.js";

export default function OtpVerify() {

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW STATE → POPUP CONTROL
  const [showSuccess, setShowSuccess] = useState(false);

  const email = localStorage.getItem("pendingEmail") || "";

  const onSubmit = async (event) => {

    event.preventDefault();
    setError("");

    if (!email) {
      setError("No email found. Please register again.");
      return;
    }

    setLoading(true);

    try {

      const data = await apiRequest(
        "/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, otp })
        }
      );

      // STORE TOKEN
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // REMOVE TEMP EMAIL
      localStorage.removeItem("pendingEmail");

      // 🔥 SHOW SUCCESS POPUP (instead of direct dashboard)
      setShowSuccess(true);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle={
        email
          ? `OTP sent to ${email}. Verify to complete registration.`
          : "Check your email for the OTP."
      }
      footer={
        <span>
          If you used the wrong email, please register again.
        </span>
      }
    >

      {/* OTP FORM */}
      <form onSubmit={onSubmit} className="form-grid">

        <div className="input-group">
          <label htmlFor="otp">Enter OTP</label>

          <input
            id="otp"
            name="otp"
            type="text"
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value)
            }
            placeholder="6-digit OTP"
            required
          />

        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn primary"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

      </form>

      {/* =========================
          SUCCESS POPUP
      ========================== */}

      {showSuccess && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h2>🎉 Registration Successful</h2>

            <p>
              Your email has been verified successfully.
            </p>

            <button
              className="btn primary"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Go To Dashboard
            </button>

          </div>

        </div>

      )}

    </AuthLayout>
  );
}
