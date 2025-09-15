import { Navigate } from "react-router-dom";
import { getToken } from "./Token.js";

export default function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" />;
}
