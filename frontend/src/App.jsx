import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Navbar from "./components/common/Navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./pages/Dashbaord";
import protectedRoute from "./components/auth/protectedRoute";
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
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
