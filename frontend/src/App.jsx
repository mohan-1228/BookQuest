import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Navbar from "./components/common/Navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserDashboard from "./pages/UserDashbaord";
import VendorDashboard from "./pages/vendorDashboard";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/common/Footer";
import "./index.css";
import UserHome from "./pages/UserHome";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Footer />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/user-home" element={<UserHome />} />
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
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
