import { useState } from "react";
import { removeToken } from "../utils/Token";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
      navigate("/login"); // redirect to login page
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h2>Home</h2>
      <p>You are successfully logged in!</p>
      <button
        className="logout-btn"
        onClick={handleLogout}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="spinner" /> Logging out...
          </>
        ) : (
          "Logout"
        )}
      </button>
    </div>
  );
}
