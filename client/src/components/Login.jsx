import { useState } from "react";
import { setToken } from "../utils/Token";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  // validation
  const validateFrontend = () => {
    const errs = [];
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!form.email || !emailRegex.test(form.email))
      errs.push("Please enter a valid email");

    if (!form.password || form.password.length < 5)
      errs.push("Password must be at least 5 characters");

    return errs;
  };

  //handle submit
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
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="spinner" /> Please wait
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="signup-link">
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>

      {errors.map((err, idx) => (
        <p key={idx} className="error">
          {err}
        </p>
      ))}
    </div>
  );
}
