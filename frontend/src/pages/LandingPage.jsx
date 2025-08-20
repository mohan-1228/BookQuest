import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  DollarSign,
  Star,
  BookOpen,
  Users,
  Shield,
  Clock,
  TrendingUp,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#1a4a52]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#0B2E33] to-[#93B1B5] shadow-lg">
        <div className="container mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">BookQuest</span>
            </div>

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

      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center pt-16 pb-20 px-5 lg:px-10">
        <div className="hero-background absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2E33] via-[#0B2E33]/90 to-transparent"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl">
            <h1 className="hero-title text-5xl lg:text-7xl font-black text-white uppercase leading-none mb-6">
              Find Any Book
              <br />
              Get Best Quotes
            </h1>
            <p className="text-xl lg:text-2xl text-white mb-8 leading-relaxed font-medium">
              Connect with readers worldwide. Request any book, compare prices,
              and get the best deals from trusted sellers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="bg-[#93B1B5] text-[#0B2E33] hover:bg-[#B8E3E9] hover:scale-105 rounded-xl px-8 py-4 text-lg font-semibold transition-all text-center"
              >
                Start Searching
              </Link>
              <Link
                to="/login"
                className="border-2 border-[#93B1B5] text-white hover:bg-[#93B1B5] hover:text-[#0B2E33] hover:scale-105 rounded-xl px-8 py-4 text-lg font-semibold transition-all text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-5 lg:px-10 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-[#0B2E33] mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-[#1a4a52] max-w-3xl mx-auto">
              Everything you need to find, request, and purchase books at the
              best prices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Smart Search
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Find any book using our AI-powered search. Search by title,
                author, ISBN, or even describe what you're looking for.
              </p>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Price Comparison
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Compare prices from multiple sellers instantly. Get the best
                deals on new, used, and rare books.
              </p>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Verified Reviews
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Read authentic reviews from real buyers. Make informed decisions
                with our community ratings.
              </p>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Global Network
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Connect with sellers worldwide. Access rare and out-of-print
                books from our global community.
              </p>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Secure Transactions
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Shop with confidence. All transactions are protected with buyer
                guarantees and secure payment processing.
              </p>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Quick Delivery
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Fast shipping options available. Track your orders and get your
                books delivered when you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 px-5 lg:px-10 bg-gradient-to-r from-[#0B2E33] to-[#1a4a52]"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Get the books you want in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#93B1B5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-[#0B2E33]">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Search & Request
              </h3>
              <p className="text-[#B8E3E9] leading-relaxed">
                Search for any book or make a request. Our smart system will
                find matches from our global network of sellers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#93B1B5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-[#0B2E33]">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Compare Quotes
              </h3>
              <p className="text-[#B8E3E9] leading-relaxed">
                Receive multiple quotes instantly. Compare prices, conditions,
                and seller ratings to make the best choice.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#93B1B5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-[#0B2E33]">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Purchase & Receive
              </h3>
              <p className="text-[#B8E3E9] leading-relaxed">
                Complete your purchase securely and track your order. Get your
                books delivered fast and enjoy reading!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-5 lg:px-10 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-[#0B2E33] mb-6">
              What Readers Say
            </h2>
            <p className="text-xl text-[#1a4a52] max-w-3xl mx-auto">
              Join thousands of satisfied book lovers who found their perfect
              reads
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#B8E3E9] rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-amber-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-[#1a4a52] mb-6 leading-relaxed">
                "Found a rare first edition that I'd been searching for years!
                The price comparison feature saved me hundreds of dollars."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#0B2E33] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">SJ</span>
                </div>
                <div>
                  <p className="text-[#0B2E33] font-semibold">Sarah Johnson</p>
                  <p className="text-[#1a4a52] text-sm">Book Collector</p>
                </div>
              </div>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-amber-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-[#1a4a52] mb-6 leading-relaxed">
                "Perfect for students! I saved 60% on textbooks compared to
                campus bookstore prices. Fast delivery too!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#0B2E33] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <p className="text-[#0B2E33] font-semibold">Mike Rodriguez</p>
                  <p className="text-[#1a4a52] text-sm">University Student</p>
                </div>
              </div>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-amber-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-[#1a4a52] mb-6 leading-relaxed">
                "The global network is amazing! I can find books in different
                languages and editions that aren't available locally."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#0B2E33] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">AC</span>
                </div>
                <div>
                  <p className="text-[#0B2E33] font-semibold">Anna Chen</p>
                  <p className="text-[#1a4a52] text-sm">Language Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-5 lg:px-10 bg-gradient-to-r from-[#0B2E33] to-[#1a4a52]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Find Your Next Great Read?
          </h2>
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto">
            Join thousands of book lovers who save time and money with
            BookQuest. Start your literary journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-[#93B1B5] text-[#0B2E33] hover:bg-[#B8E3E9] hover:scale-105 rounded-xl px-12 py-4 text-lg font-semibold transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              to="/login"
              className="border-2 border-[#93B1B5] text-white hover:bg-[#93B1B5] hover:text-[#0B2E33] hover:scale-105 rounded-xl px-12 py-4 text-lg font-semibold transition-all"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B2E33] py-16 px-5 lg:px-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <BookOpen className="h-8 w-8 text-white" />
                <span className="text-xl font-bold text-white">BookQuest</span>
              </div>
              <p className="text-[#B8E3E9] leading-relaxed">
                The world's largest network for book requests and quotes. Find
                any book, get the best price.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Search Books
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Price Comparison
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Seller Network
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Seller Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#B8E3E9] hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#93B1B5] pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-[#B8E3E9] mb-4 md:mb-0">
                © 2024 BookQuest. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-[#B8E3E9] hover:text-white transition-colors"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-[#B8E3E9] hover:text-white transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-[#B8E3E9] hover:text-white transition-colors"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
