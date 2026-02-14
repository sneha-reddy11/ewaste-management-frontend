import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";   // 👈 ADDED
import AuthLayout from "../components/AuthLayout.jsx";
import { apiRequest } from "../api.js";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 👁️ TOGGLE STATE
  const [showPassword, setShowPassword] =
    useState(false);

  const onChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const onSubmit = async (event) => {

    event.preventDefault();
    setError("");
    setLoading(true);

    try {

      const data = await apiRequest(
        "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          })
        }
      );

      localStorage.setItem(
        "token",
        data.token
      );

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login with your email and password"
      footer={
        <span>
          New here?
          <Link to="/register">
            {" "}Create account
          </Link>
        </span>
      }
    >
      <form
        onSubmit={onSubmit}
        className="form-grid"
      >

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

        {/* PASSWORD 👁️ PROFESSIONAL */}
        <div className="input-group">

          <label>Password</label>

          <div className="password-wrapper">

            <input
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={form.password}
              onChange={onChange}
              required
            />

            <button
              type="button"
              className="toggle-eye"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? <FaEyeSlash />
                : <FaEye />}
            </button>

          </div>
        </div>

        {/* FORGOT PASSWORD */}
        <div className="forgot-link">
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
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
            ? "Signing in..."
            : "Login"}
        </button>

      </form>
    </AuthLayout>
  );
}
