import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Menu, X } from "lucide-react";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#0B2E33] to-[#93B1B5] shadow-lg">
      <div className="container mx-auto px-5 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">BookQuest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-white hover:text-[#B8E3E9] transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-white hover:text-[#B8E3E9] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-white hover:text-[#B8E3E9] transition-colors"
            >
              Reviews
            </a>
            <a
              href="#pricing"
              className="text-white hover:text-[#B8E3E9] transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-white hover:text-[#B8E3E9] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#0B2E33] text-white hover:bg-[#1A4D53] px-6 py-2 rounded-xl transition-all duration-300 font-semibold"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0B2E33] px-5 py-4">
          <div className="flex flex-col space-y-4">
            <a
              href="#features"
              className="text-white hover:text-[#B8E3E9] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-white hover:text-[#B8E3E9] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-white hover:text-[#B8E3E9] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Reviews
            </a>
            <a
              href="#pricing"
              className="text-white hover:text-[#B8E3E9] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <div className="pt-4 border-t border-[#93B1B5] flex flex-col space-y-3">
              <Link
                to="/login"
                className="text-white hover:text-[#B8E3E9] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-[#93B1B5] text-[#0B2E33] hover:bg-[#B8E3E9] px-4 py-2 rounded-xl transition-all duration-300 font-semibold text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
