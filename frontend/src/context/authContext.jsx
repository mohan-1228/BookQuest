import React, { createContext, useState, useContext, useEffect } from "react";
import { API_BASE_URL } from "../services/api"; // Ensure this is 'http://localhost:5000'

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem("userToken");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData); // This line is crucial!
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        // Clear invalid data
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Registration failed. Status: ${response.status}`
        );
      }

      if (data.success) {
        // USE THE CONSISTENT KEY NAME: 'userToken'
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error.message || "Registration failed. Please check the server.",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Login failed. Status: ${response.status}`
        );
      }

      if (data.success) {
        // USE THE CONSISTENT KEY NAME: 'userToken'
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
      return data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message || "Login failed. Please check the server.",
      };
    }
  };

  const logout = () => {
    // USE THE CONSISTENT KEY NAME: 'userToken'
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    currentUser: user, // This provides 'user'. Make sure your components use `const { user } = useAuth();`
    register,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
