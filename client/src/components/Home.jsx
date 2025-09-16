import { useState } from "react";
import { removeToken } from "../utils/Token";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data?.message || "Logged out successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Logout failed!");
    } finally {
      removeToken();
      navigate("/login");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Left Section */}
        <div className="login-form-section">
          <h2 className="login-title">Welcome Home</h2>
          <p style={{ color: "#ccc", marginBottom: "20px" }}>
            You are successfully logged in! Enjoy your secure session.
          </p>

          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="login-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="spin" size={16} /> Logging out...
              </>
            ) : (
              <>
                <LogOut size={18} /> Logout
              </>
            )}
          </button>
        </div>

        {/* Right Section */}
        <div className="login-info-section">
          <h2 className="info-title">Dashboard</h2>
          <p className="info-text">
            Manage your profile, access secure features, and explore your
            account dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
