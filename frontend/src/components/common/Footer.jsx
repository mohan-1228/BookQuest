import React from "react";
import { Outlet } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex-grow">
        <Outlet /> {/* Renders the child route */}
      </div>

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

export default Footer;
