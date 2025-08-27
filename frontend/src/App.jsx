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
import BookRequestForm from "./pages/RequestForm";
import VendorRequests from "./pages/Requests";
import UserRequestsPage from "./pages/UserRequests";
import VendorHome from "./pages/VendorHome";

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

              <Route path="/book-request" element={<BookRequestForm />} />
              <Route
                path="/my-requests"
                element={
                  <ProtectedRoute>
                    <UserRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-home"
                element={
                  <ProtectedRoute>
                    <UserHome />
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

              <Route
                path="/vendor-home"
                element={
                  <ProtectedRoute>
                    <VendorHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <VendorRequests />
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
