import { useState } from "react";
import { setToken } from "../utils/Token";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateFrontend = () => {
    const errs = [];
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!form.name || form.name.trim().length < 3)
      errs.push("Name must be at least 3 characters");
    if (!form.email || !emailRegex.test(form.email))
      errs.push("Please enter a valid email");
    if (!form.password || form.password.length < 5)
      errs.push("Password must be at least 5 characters");

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const errs = validateFrontend();
    if (errs.length) {
      setErrors(errs);
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/signup`, form, {
        withCredentials: true,
      });

      setToken(response.data.token);
      toast.success("Signup successful!");
      navigate("/home");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setErrors([err.response?.data?.message || "Server error"]);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Left Section */}
        <div className="login-form-section">
          <h2 className="login-title">Create Account</h2>

          <form onSubmit={handleSubmit}>
            {/* Name Field with Icon */}
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="name"
                className="input-field"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Field with Icon */}
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Field with Icon + Toggle */}
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input-field"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="error-box">
                {errors.map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            )}

            {/* Button */}
            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="spin" size={18} /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="signup-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

        {/* Right Section */}
        <div className="login-info-section">
          <h2 className="info-title">Welcome to Future Auth</h2>
          <p className="info-text">
            Secure, fast, and modern authentication system built for you.
          </p>
        </div>
      </div>
    </div>
  );
}
