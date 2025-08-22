import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../context/authContext";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#0B2E33] to-[#93B1B5] shadow-lg">
      <div className="container mx-auto px-5 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => {
              if (currentUser) e.preventDefault(); // stop navigation
            }}
            className={`flex items-center space-x-2 ${
              currentUser ? "cursor-default" : "cursor-pointer"
            }`}
          >
            <BookOpen className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">BookQuest</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {!currentUser ? (
              <>
                <a href="#features" className="text-white hover:text-[#B8E3E9]">
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-white hover:text-[#B8E3E9]"
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="text-white hover:text-[#B8E3E9]"
                >
                  Reviews
                </a>
                <a href="#pricing" className="text-white hover:text-[#B8E3E9]">
                  Pricing
                </a>
              </>
            ) : (
              <>
                <Link
                  to={
                    currentUser.role === "vendor"
                      ? "/vendor-dashboard"
                      : "/user-dashboard"
                  }
                  className="text-white hover:text-[#B8E3E9] flex items-center gap-1"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                {currentUser.role === "user" && (
                  <Link
                    to="/my-requests"
                    className="text-white hover:text-[#B8E3E9] flex items-center gap-1"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    My Requests
                  </Link>
                )}
                {currentUser.role === "vendor" && (
                  <Link
                    to="/my-quotes"
                    className="text-white hover:text-[#B8E3E9] flex items-center gap-1"
                  >
                    <Package className="h-4 w-4" />
                    My Quotes
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:text-[#B8E3E9]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#0B2E33] text-white hover:bg-[#1A4D53] px-6 py-2 rounded-xl font-semibold transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-white hover:text-[#B8E3E9]"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span>
                      {currentUser.businessName ||
                        currentUser.name ||
                        currentUser.email}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                      <Link
                        to={
                          currentUser.role === "vendor"
                            ? "/vendor-dashboard"
                            : "/user-dashboard"
                        }
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutDashboard className=" inline h-4 w-4 mr-1.5" />
                        Dashboard
                      </Link>

                      {currentUser.role === "user" && (
                        <Link
                          to="/my-requests"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <ShoppingCart className="inline h-4 w-4 mr-1.5" />
                          My Requests
                        </Link>
                      )}

                      {currentUser.role === "vendor" && (
                        <Link
                          to="/my-quotes"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          My Quotes
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="inline h-4 w-4 mr-1.5" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
