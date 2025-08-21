import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Navbar from "./components/common/Navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserDashboard from "./pages/UserDashbaord";
import VendorDashboard from "./pages/VendorDashboard";
import LandingPage from "./pages/LandingPage";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor-dashboard"
              element={
                <ProtectedRoute>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
