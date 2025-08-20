import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import bookforlogin from "../../assets/bookforlogin.jpg";
import "../../index.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "reader",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

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

    const result = await register(formData);

    if (result.success) {
      // Redirect to dashboard or home page
      window.location.href = "/dashboard";
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#1a4a52] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left side - Image and branding */}
        <div className="lg:w-2/5 bg-primary p-0 flex flex-col justify-between overflow-hidden">
          <div className="h-full w-full">
            <img
              src={bookforlogin}
              alt="Books Stacked"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right side - Signup form */}
        <div className="lg:w-3/5 p-10">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Join BookQuest Today
          </h2>
          <p className="text-primary mb-8">
            Connect readers with sellers worldwide. Get the books you need or
            start your bookselling business.
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
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition focus-ring text-primary"
              />
            </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full px-4 py-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition focus-ring text-primary"
              />
            </div>

            <div className="bg-[#B8E3E9] bg-opacity-30 p-4 rounded-lg">
              <h4 className="font-medium text-primary mb-3">
                I want to join as:
              </h4>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="reader"
                    name="userType"
                    value="reader"
                    checked={formData.userType === "reader"}
                    onChange={handleChange}
                    className="h-4 w-4 text-accent focus:ring-accent"
                  />
                  <label
                    htmlFor="reader"
                    className="ml-2 block text-sm text-primary"
                  >
                    Reader
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="seller"
                    name="userType"
                    value="seller"
                    checked={formData.userType === "seller"}
                    onChange={handleChange}
                    className="h-4 w-4 text-accent focus:ring-accent"
                  />
                  <label
                    htmlFor="seller"
                    className="ml-2 block text-sm text-primary"
                  >
                    Book Seller
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 text-accent focus:ring-accent border-secondary rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-primary"
              >
                I agree to the{" "}
                <a href="#" className="text-accent font-medium hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary font-medium py-3 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <p className="text-center text-sm text-primary mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-accent font-medium hover:underline"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
