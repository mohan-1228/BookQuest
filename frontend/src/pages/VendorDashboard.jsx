import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { requestsAPI, quotesAPI } from "../services/api";
import {
  Package,
  DollarSign,
  MessageSquareQuote,
  Bell,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const VendorDashboard = () => {
  const { currentUser } = useAuth();
  const [openRequests, setOpenRequests] = useState([]);
  const [mySubmittedQuotes, setMySubmittedQuotes] = useState([]);
  const [stats, setStats] = useState({
    totalQuotes: 0,
    acceptedQuotes: 0,
    openRequests: 0,
    avgResponseTime: "0h",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null); // New state for fetch errors

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setFetchError(null);

        const [requestsResponse, quotesResponse] = await Promise.all([
          requestsAPI.getAll(),
          quotesAPI.getMyQuotes(),
        ]);

        // Use requestsResponse.data.data (the actual array) instead of requestsResponse.data
        const openRequestsData = Array.isArray(requestsResponse.data.data)
          ? requestsResponse.data.data.slice(0, 5)
          : [];

        const quotesData = Array.isArray(quotesResponse.data.data)
          ? quotesResponse.data.data
          : [];

        setOpenRequests(openRequestsData);
        setMySubmittedQuotes(quotesData);

        setStats({
          totalQuotes: quotesData.length,
          acceptedQuotes: quotesData.filter((q) => q.status === "accepted")
            .length,
          openRequests: openRequestsData.length,
          avgResponseTime: "4h",
        });
      } catch (error) {
        console.error("Failed to fetch vendor dashboard data:", error);
        setFetchError("Failed to load vendor data.");
        setOpenRequests([]);
        setMySubmittedQuotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorData();
  }, [currentUser]); // Add currentUser as a dependency

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2E33]"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#0B2E33] text-white py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header - Reuse your header structure */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B8E3E9] to-[#93B1B5] flex items-center justify-center">
                <span className="text-[#0B2E33] font-semibold">
                  {currentUser?.businessName?.charAt(0) ||
                    currentUser?.name?.charAt(0) ||
                    "V"}
                </span>
              </div>
              <span className="text-gray-700">
                {currentUser?.businessName || currentUser?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Vendor Specific */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#0B2E33] to-[#93B1B5] rounded-2xl p-6 text-white mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">
            Welcome, {currentUser?.businessName || "Vendor"}!
          </h2>
          <p className="mb-4 opacity-90">
            Find new book requests and manage your quotes.
          </p>
          <Link
            to="/requests"
            className="inline-block bg-white text-[#0B2E33] hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-all duration-300"
          >
            View All Requests
          </Link>
        </div>

        {/* Stats Overview for Vendor */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                <MessageSquareQuote className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-black">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalQuotes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-black">Accepted Quotes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.acceptedQuotes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-100 text-amber-600 mr-4">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-black">Open Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.openRequests}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-black">Avg. Response</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgResponseTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections for Vendor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Open Requests */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
              <Package className="h-5 w-5" />
              Recent Open Requests
            </h3>
            <div className="space-y-4">
              {openRequests.length > 0 ? (
                openRequests.map((request) => (
                  <div
                    key={request._id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-medium text-black">{request.title}</h4>
                    <p className="text-sm text-gray-500">by {request.author}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      ISBN: {request.isbn}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {request.status}
                      </span>
                      <Link
                        to={`/request/${request._id}`}
                        className="text-sm text-[#0B2E33] hover:underline"
                      >
                        Submit Quote
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-900 text-center py-8">
                  No open requests found.
                </p>
              )}
            </div>
          </div>

          {/* My Recent Quotes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
              <DollarSign className="h-5 w-5" />
              My Recent Quotes
            </h3>
            <div className="space-y-4">
              {mySubmittedQuotes.length > 0 ? (
                mySubmittedQuotes.slice(0, 3).map((quote) => (
                  <div
                    key={quote._id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-black">
                          {quote.requestId?.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Price: ${quote.price}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          quote.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : quote.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {quote.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Notes: {quote.notes || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-900 text-center py-8">
                  You haven't submitted any quotes yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default VendorDashboard;
