import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout.jsx";
import { apiRequest } from "../api.js";

export default function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  // 👇 GET EMAIL FROM PROFILE PAGE
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setStatus("");

    if (!email) {
      setError("Email not found. Please try again.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match ❌");
      return;
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!regex.test(password)) {
      setError(
        "Password must contain:\n" +
        "• 1 Capital letter\n" +
        "• 1 Small letter\n" +
        "• 1 Number\n" +
        "• 1 Symbol\n" +
        "• Minimum 8 characters"
      );
      return;
    }

    setLoading(true);

    try {

      const res = await apiRequest(
        "/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword: password
          })
        }
      );

      setStatus(res.message || "Password reset successful ✅");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle={`OTP sent to ${email || "your registered email"}`}
    >
      <form onSubmit={onSubmit} className="form-grid">

        <div className="input-group">
          <label>OTP</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>New Password</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Confirm Password</label>

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-eye"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {status && <div className="form-success">{status}</div>}

        <button className="btn primary" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>
    </AuthLayout>
  );
}