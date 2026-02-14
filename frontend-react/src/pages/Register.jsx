import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";   // 👈 ADDED
import AuthLayout from "../components/AuthLayout.jsx";
import { apiRequest } from "../api.js";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 👁️ TOGGLE STATES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  /* ================================
     PASSWORD VALIDATION
  ================================ */
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  /* ================================
     PHONE VALIDATION
  ================================ */
  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  /* ================================
     FORM SUBMIT
  ================================ */
  const onSubmit = async (event) => {

    event.preventDefault();
    setError("");

    if (!validatePhone(form.phone)) {
      setError(
        "Phone number must contain exactly 10 digits."
      );
      return;
    }

    if (!validatePassword(form.password)) {
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {

      await apiRequest("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password
        })
      });

      localStorage.setItem(
        "pendingEmail",
        form.email
      );

      navigate("/verify-otp");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     UI
  ================================ */

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start the e-waste pickup journey"
      footer={
        <span>
          Already registered?
          <Link to="/login"> Login</Link>
        </span>
      }
    >
      <form
        onSubmit={onSubmit}
        className="form-grid"
      >

        {/* NAME */}
        <div className="input-group">
          <label>Full Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            required
          />
        </div>

        {/* EMAIL */}
        <div className="input-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>

        {/* PHONE */}
        <div className="input-group">
          <label>Phone</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            maxLength="10"
            required
          />
        </div>

        {/* PASSWORD 👁️ */}
        <div className="input-group">
          <label>Password</label>

          <div className="password-wrapper">

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              required
            />

            <button
              type="button"
              className="toggle-eye"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>
        </div>

        {/* CONFIRM PASSWORD 👁️ */}
        <div className="input-group">
          <label>Confirm Password</label>

          <div className="password-wrapper">

            <input
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={form.confirmPassword}
              onChange={onChange}
              required
            />

            <button
              type="button"
              className="toggle-eye"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? <FaEyeSlash />
                : <FaEye />}
            </button>

          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="btn primary"
          disabled={loading}
        >
          {loading
            ? "Sending OTP..."
            : "Register"}
        </button>

      </form>
    </AuthLayout>
  );
}
