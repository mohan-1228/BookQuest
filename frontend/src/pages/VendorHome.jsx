import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import book1 from "../assets/book1.jpg";
import book2 from "../assets/book2.jpg";
import book3 from "../assets/book3.jpg";
import book4 from "../assets/book4.jpg";
import book5 from "../assets/book5.jpg";
import book6 from "../assets/book6.jpg";
import book7 from "../assets/book7.jpg";
import book8 from "../assets/book8.jpg";
import book9 from "../assets/book9.jpg";
import book0 from "../assets/book0.jpg";

import {
  Search,
  DollarSign,
  Star,
  BookOpen,
  Users,
  Shield,
  Clock,
  Package,
  TrendingUp,
  MessageSquareQuote,
  Eye,
} from "lucide-react";

const VendorHome = () => {
  const images = [
    book1,
    book2,
    book3,
    book4,
    book5,
    book6,
    book7,
    book8,
    book9,
    book0,
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      // Change image after a brief delay to allow transition to complete
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 800); // Slightly less than the transition duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#1a4a52]">
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center pt-16 pb-20 px-5 lg:px-10 overflow-hidden">
        {/* Background Images */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${images[currentImage]})`,
            opacity: isTransitioning ? 0.7 : 1,
            transform: isTransitioning ? "scale(1.05)" : "scale(1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2E33] via-[#0B2E33]/90 to-transparent"></div>
        </div>

        {/* Hero Text */}
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl">
            <h1 className="hero-title text-5xl lg:text-7xl font-black text-white uppercase leading-none mb-6">
              Connect with Readers
              <br />
              Grow Your Business
            </h1>
            <p className="text-xl lg:text-2xl text-white mb-8 leading-relaxed font-medium">
              Reach book lovers worldwide. Get notified of book requests, submit
              competitive quotes, and grow your customer base.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/requests"
                className="bg-[#93B1B5] text-[#0B2E33] hover:bg-[#B8E3E9] hover:scale-105 rounded-xl px-8 py-4 text-lg font-semibold transition-all text-center"
              >
                Browse Requests
              </Link>
              <Link
                to="/dashboard"
                className="border-2 border-[#93B1B5] text-white hover:bg-[#93B1B5] hover:text-[#0B2E33] hover:scale-105 rounded-xl px-8 py-4 text-lg font-semibold transition-all text-center"
              >
                View Dashboard
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
              Vendor Benefits
            </h2>
            <p className="text-xl text-[#1a4a52] max-w-3xl mx-auto">
              Everything you need to grow your book business and connect with
              eager readers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Direct Access to Buyers
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Connect directly with readers looking for specific books. No
                middlemen, no commissions, just direct sales.
              </p>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Increase Sales
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Reach customers actively searching for books. Sell inventory
                faster with our targeted request system.
              </p>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Manage Inventory
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Easily manage your book inventory. Get notified when readers are
                looking for books you have in stock.
              </p>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <MessageSquareQuote className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Quote System
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Submit competitive quotes for book requests. Set your prices and
                negotiate directly with buyers.
              </p>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Secure Payments
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Get paid securely with our protected payment system. Focus on
                selling while we handle transaction security.
              </p>
            </div>

            <div className="bg-[#B8E3E9] rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-[#0B2E33] rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B2E33] mb-4">
                Build Reputation
              </h3>
              <p className="text-[#1a4a52] leading-relaxed">
                Earn reviews and build your seller reputation. Trusted vendors
                get more visibility and sales.
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
              How It Works For Vendors
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Start selling books in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#93B1B5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-[#0B2E33]">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Set Up Your Profile
              </h3>
              <p className="text-[#B8E3E9] leading-relaxed">
                Create your vendor profile, add your inventory, and set your
                preferences for the types of books you sell.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#93B1B5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-[#0B2E33]">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Receive Requests
              </h3>
              <p className="text-[#B8E3E9] leading-relaxed">
                Get notified when readers are looking for books you have in
                stock. Browse open requests at any time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#93B1B5] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-black text-[#0B2E33]">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Submit Quotes & Sell
              </h3>
              <p className="text-[#B8E3E9] leading-relaxed">
                Submit competitive quotes, communicate with buyers, and complete
                sales with our secure system.
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
              What Vendors Say
            </h2>
            <p className="text-xl text-[#1a4a52] max-w-3xl mx-auto">
              Join hundreds of successful booksellers growing their business
              with us
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
                "Increased my monthly sales by 40% since joining! The direct
                access to serious buyers is game-changing for small
                booksellers."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#0B2E33] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">JR</span>
                </div>
                <div>
                  <p className="text-[#0B2E33] font-semibold">
                    James Richardson
                  </p>
                  <p className="text-[#1a4a52] text-sm">Rare Books Seller</p>
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
                "Finally found a platform that understands booksellers' needs.
                The quote system makes it so easy to connect with the right
                customers."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#0B2E33] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">SP</span>
                </div>
                <div>
                  <p className="text-[#0B2E33] font-semibold">Sarah Peterson</p>
                  <p className="text-[#1a4a52] text-sm">
                    Online Bookstore Owner
                  </p>
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
                "The inventory management tools saved me hours each week. Now I
                can focus on sourcing great books instead of marketing."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#0B2E33] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">ML</span>
                </div>
                <div>
                  <p className="text-[#0B2E33] font-semibold">Michael Lee</p>
                  <p className="text-[#1a4a52] text-sm">
                    Used Books Specialist
                  </p>
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
            Ready to Grow Your Book Business?
          </h2>
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto">
            Join our network of successful booksellers and start connecting with
            readers who are actively looking for your books.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register-vendor"
              className="bg-[#93B1B5] text-[#0B2E33] hover:bg-[#B8E3E9] hover:scale-105 rounded-xl px-12 py-4 text-lg font-semibold transition-all"
            >
              Become a Vendor
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-[#93B1B5] text-white hover:bg-[#93B1B5] hover:text-[#0B2E33] hover:scale-105 rounded-xl px-12 py-4 text-lg font-semibold transition-all"
            >
              Vendor Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorHome;
