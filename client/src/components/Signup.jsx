import { useState } from "react";
import { setToken } from "../utils/Token";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const validateField = (name, value) => {
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (name === "name") {
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 5) return "Name must be at least 5 characters";
    }
    if (name === "email") {
      if (!value.trim()) return "Email is required";
      if (!emailRegex.test(value)) return "Please enter a valid email";
    }
    if (name === "password") {
      if (!value.trim()) return "Password is required";
      if (value.length < 5) return "Password must be at least 5 characters";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-form-section">
          <h2 className="login-title">Create Account</h2>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className={`input-field ${errors.name ? "input-error" : ""}`}
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            {errors.name && <p className="error-text">{errors.name}</p>}

            {/* Email */}
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={`input-field ${errors.email ? "input-error" : ""}`}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}

            {/* Password */}
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`input-field ${
                  errors.password ? "input-error" : ""
                }`}
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
            {errors.password && <p className="error-text">{errors.password}</p>}

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
