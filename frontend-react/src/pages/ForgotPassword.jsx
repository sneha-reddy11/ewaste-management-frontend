import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { apiRequest } from "../api.js";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {

    e.preventDefault();
    setError("");
    setStatus("");

    // 📧 Basic email validation
    if (!email.includes("@")) {
      setError("Enter valid email address");
      return;
    }

    setLoading(true);

    try {

      const res = await apiRequest(
        "/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      setStatus(
        res.message ||
        "OTP sent to your email 📩"
      );

      // Store email for reset page
      localStorage.setItem(
        "resetEmail",
        email
      );

      // Redirect after success
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your registered email"
    >
      <form
        onSubmit={onSubmit}
        className="form-grid"
      >

        {/* EMAIL */}
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter registered email"
            required
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {status && (
          <div className="form-success">
            {status}
          </div>
        )}

        {/* BUTTON */}
        <button
          className="btn primary"
          disabled={loading}
        >
          {loading
            ? "Sending OTP..."
            : "Send OTP"}
        </button>

      </form>
    </AuthLayout>
  );
}
