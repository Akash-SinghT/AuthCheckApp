import { useState } from "react";
import { setToken } from "../utils/Token";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
    if (!form.email || !emailRegex.test(form.email))
      errs.push("Please enter a valid email");
    if (!form.password || form.password.length < 5)
      errs.push("Password must be at least 5 characters");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    const errs = validateFrontend();
    if (errs.length) {
      setErrors(errs);
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/login`, form, {
        withCredentials: true,
      });

      setToken(res.data.token);
      toast.success("Login successful!");
      navigate("/home");
      setForm({ email: "", password: "" });
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
          <h2 className="login-title">Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            {/* Email Field with Icon */}
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Password Field with Icon + Toggle */}
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

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

          {errors.length > 0 && (
            <div className="error-box">
              {errors.map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}
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
