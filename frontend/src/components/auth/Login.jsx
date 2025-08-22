import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import bookforlogin from "../../assets/bookforlogin.jpg";
import "../../index.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);
      console.log("Login result:", result);

      if (result.user) {
        // Navigate based on user role
        if (result.user.role === "vendor") {
          navigate("/vendor-dashboard");
        } else {
          navigate("/user-home");
        }
      } else if (result.success) {
        // Fallback if no user data
        console.warn("Login successful but no user data returned");
        navigate("/user-dashboard"); // Default to user dashboard
      } else {
        setError("User data missing. Please contact support.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#1a4a52] flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left side - Image */}
        <div className="lg:w-2/5 bg-primary p-0 flex flex-col justify-between overflow-hidden">
          <div className="h-full w-full">
            <img
              src={bookforlogin}
              alt="Books Stacked"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="lg:w-3/5 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back</h2>
          <p className="text-primary mb-8">
            Sign in to continue your book journey with BookQuest
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-primary text-sm font-medium mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition focus-ring text-primary"
              />
            </div>

            <div>
              <label
                className="block text-primary text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition focus-ring text-primary"
              />
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-accent focus:ring-accent border-secondary rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-primary"
                >
                  Remember me
                </label>
              </div>

              <a href="#" className="text-sm text-accent hover:underline">
                Forgot password?
              </a>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary font-medium py-3 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <p className="text-center text-sm text-primary mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-accent font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
