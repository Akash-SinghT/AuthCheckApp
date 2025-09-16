import { useState } from "react";
import { setToken } from "../utils/Token";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const validateField = (name, value) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value)) return "Please enter a valid email";
        return "";
      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 5) return "Password must be at least 5 characters";
        return "";
      default:
        return "";
    }
  };

  const validateAll = () => {
    const newErrors = {
      email: validateField("email", form.email),
      password: validateField("password", form.password),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login`, form, {
        withCredentials: true,
      });

      setToken(res.data.token);
      toast.success("Login successful!");
      navigate("/home");
      setForm({ email: "", password: "" });
    } catch (err) {
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
          <h2 className="login-title">Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? "input-error" : ""}`}
                required
              />
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}

            {/* Password Field */}
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={`input-field ${
                  errors.password ? "input-error" : ""
                }`}
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

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="spin" size={16} /> Please wait
                </>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          <p className="signup-text">
            Don't have an account? <Link to="/signup">Create account</Link>
          </p>
        </div>

        {/* Right Section */}
        <div className="login-info-section">
          <h2 className="info-title">FUTURE AUTH</h2>
          <p className="info-text">
            Experience the next generation authentication system with
            cutting-edge security and seamless UX.
          </p>
        </div>
      </div>
    </div>
  );
}
