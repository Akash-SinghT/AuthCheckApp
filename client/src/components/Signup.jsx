import { useState } from "react";
import { setToken } from "../utils/Token";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  // validate
  const validateFrontend = () => {
    const errs = [];
    if (!form.name || form.name.length < 3)
      errs.push("Name must be at least 3 characters");
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!form.email || !emailRegex.test(form.email)) errs.push("Invalid email");
    if (!form.password || form.password.length < 5)
      errs.push("Password must be at least 5 characters");
    return errs;
  };
  //Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const errs = validateFrontend();
    if (errs.length) {
      setErrors(errs);
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
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
            "Signup"
          )}
        </button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>

      {errors.map((err, idx) => (
        <p key={idx} className="error">
          {err}
        </p>
      ))}
    </div>
  );
}
