import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import Signup from "./components/Signup";
import Login from "./components/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          // protect route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
