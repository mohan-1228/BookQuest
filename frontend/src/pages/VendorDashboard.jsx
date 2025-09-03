import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/authContext";
import { requestsAPI, quotesAPI } from "../services/api";
import {
  Package,
  DollarSign,
  MessageSquareQuote,
  Bell,
  TrendingUp,
  Clock,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  Eye,
  BookOpen,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import RequestDetailModal from "../components/common/RequestDetailModal";

const VendorDashboard = () => {
  const { currentUser } = useAuth();
  const [openRequests, setOpenRequests] = useState([]);
  const [mySubmittedQuotes, setMySubmittedQuotes] = useState([]);
  const [stats, setStats] = useState({
    totalQuotes: 0,
    acceptedQuotes: 0,
    openRequests: 0,
    avgResponseTime: "0h",
    pendingQuotes: 0,
    rejectedQuotes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  // Helper function to get nested properties safely
  const getNestedValue = (obj, path, defaultValue = "Unknown") => {
    if (!obj) return defaultValue;

    const value = path.split(".").reduce((acc, part) => {
      if (acc && acc[part] !== undefined) {
        return acc[part];
      }
      return undefined;
    }, obj);

    return value !== undefined ? value : defaultValue;
  };

  // Memoized data fetching function
  const fetchVendorData = useCallback(async () => {
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

      // Extract requests from the API response - based on the new structure
      const openRequestsData = requestsResponse.data?.data || [];

      // Extract quotes from the API response
      const quotesData = quotesResponse.data?.data || quotesResponse.data || [];

      setOpenRequests(openRequestsData);
      setMySubmittedQuotes(quotesData);

      // Calculate average response time
      const pendingQuotes = quotesData.filter(
        (q) => q.status === "pending"
      ).length;
      const rejectedQuotes = quotesData.filter(
        (q) => q.status === "rejected"
      ).length;

      // Calculate actual average response time if you have timestamp data
      const avgResponseTime = calculateAvgResponseTime(quotesData);

      setStats({
        totalQuotes: quotesData.length,
        acceptedQuotes: quotesData.filter((q) => q.status === "accepted")
          .length,
        openRequests: openRequestsData.length,
        avgResponseTime,
        pendingQuotes,
        rejectedQuotes,
      });
    } catch (error) {
      console.error("Failed to fetch vendor dashboard data:", error);
      setFetchError("Failed to load vendor data. Please try again.");
      setOpenRequests([]);
      setMySubmittedQuotes([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  // Calculate average response time function
  const calculateAvgResponseTime = (quotes) => {
    if (!quotes.length) return "0h";

    const respondedQuotes = quotes.filter(
      (q) => q.submittedAt && q.requestCreatedAt
    );
    if (!respondedQuotes.length) return "N/A";

    const totalHours = respondedQuotes.reduce((total, quote) => {
      const submitted = new Date(quote.submittedAt);
      const created = new Date(quote.requestCreatedAt);
      const diffHours = (submitted - created) / (1000 * 60 * 60);
      return total + diffHours;
    }, 0);

    const avgHours = totalHours / respondedQuotes.length;
    return `${Math.round(avgHours)}h`;
  };

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVendorData();
  };

  // Filter quotes based on search term and status
  const filteredQuotes = mySubmittedQuotes.filter((quote) => {
    const requestTitle = getNestedValue(quote, "requestId.title", "");
    const matchesSearch = requestTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || quote.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filter open requests based on search term
  const filteredRequests = openRequests.filter((request) => {
    // Search through all books in the request
    const hasMatchingBook = request.books?.some(
      (book) =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.includes(searchTerm)
    );

    return hasMatchingBook;
  });

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      open: { color: "bg-blue-100 text-blue-800", text: "Open" },
      pending: { color: "bg-amber-100 text-amber-800", text: "Pending" },
      accepted: { color: "bg-green-100 text-green-800", text: "Accepted" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
      fulfilled: { color: "bg-green-100 text-green-800", text: "Fulfilled" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.open;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2E33]"></div>
      </div>
    );
  }

  if (fetchError && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{fetchError}</p>
          <button
            onClick={handleRefresh}
            className="bg-[#0B2E33] text-white py-2 px-4 rounded-lg flex items-center justify-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#1a4a52]">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw
                  className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-[#0B2E33] to-[#93B1B5] rounded-2xl p-6 text-white mb-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">
                Welcome, {currentUser?.businessName || "Vendor"}!
              </h2>
              <p className="mb-4 opacity-90">
                Find new book requests and manage your quotes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/requests"
                  className="inline-block bg-white text-[#0B2E33] hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-all duration-300"
                >
                  View All Requests
                </Link>
                <Link
                  to="/quotes"
                  className="inline-block border border-white text-white hover:bg-white hover:text-[#0B2E33] font-medium py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Manage Quotes
                </Link>
              </div>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#0B2E33] to-transparent opacity-20"></div>
          </div>

          {/* Stats Overview */}
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
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalQuotes > 0
                      ? `${Math.round(
                          (stats.acceptedQuotes / stats.totalQuotes) * 100
                        )}% success rate`
                      : "No quotes submitted"}
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

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-black">
                Quote Status Breakdown
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.pendingQuotes}
                  </p>
                  <p className="text-sm text-blue-800">Pending</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {stats.acceptedQuotes}
                  </p>
                  <p className="text-sm text-green-800">Accepted</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejectedQuotes}
                  </p>
                  <p className="text-sm text-red-800">Rejected</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-black">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/requests"
                  className="bg-[#0B2E33] text-white text-center py-2 px-4 rounded-lg hover:bg-[#0a2529] transition-colors"
                >
                  Browse Requests
                </Link>
                <Link
                  to="/profile"
                  className="border border-[#0B2E33] text-[#0B2E33] text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Open Requests */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-black">
                  <Package className="h-5 w-5" />
                  Recent Open Requests
                </h3>
              </div>
              <div className="space-y-4">
                {filteredRequests.length > 0 ? (
                  filteredRequests.slice(0, 5).map((request) => {
                    const firstBook = request.books?.[0] || {};
                    return (
                      <div
                        key={request._id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="font-medium text-black">
                          {firstBook.title || "Untitled Book"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          by {firstBook.author || "Unknown Author"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          ISBN: {firstBook.isbn || "No ISBN"}
                        </p>
                        <div className="mt-2 flex justify-between items-center">
                          <StatusBadge status={request.status} />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewRequest(request)}
                              className="text-[#0B2E33] hover:text-[#0a2529] flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </button>

                            <Link
                              to={`/requests/${request._id}/submit-quote`}
                              className="text-sm bg-[#0B2E33] text-white py-1 px-3 rounded-md hover:bg-[#0a2529] flex items-center"
                            >
                              <DollarSign className="h-3 w-3 mr-1" /> Quote
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-900 text-center py-8">
                    {searchTerm
                      ? "No matching requests found."
                      : "No open requests found."}
                  </p>
                )}
              </div>
              {openRequests.length > 5 && (
                <div className="mt-4 text-center">
                  <Link
                    to="/requests"
                    className="text-[#0B2E33] hover:underline text-sm"
                  >
                    View all requests ({openRequests.length})
                  </Link>
                </div>
              )}
            </div>

            {/* My Recent Quotes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-black">
                  <DollarSign className="h-5 w-5" />
                  My Recent Quotes
                </h3>
              </div>
              <div className="space-y-4">
                {filteredQuotes.length > 0 ? (
                  filteredQuotes.slice(0, 3).map((quote) => (
                    <div
                      key={quote._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-black">
                            {/* Show first book title or request reference */}
                            {quote.books?.[0]?.title ||
                              getNestedValue(
                                quote,
                                "requestId.title",
                                "Unknown Request"
                              ) ||
                              `Quote #${quote._id.substring(0, 8)}`}
                          </h4>
                          <p className="text-sm text-gray-700">
                            {/* Use totalPrice instead of price */}
                            Total: ${quote.totalPrice?.toFixed(2) || "0.00"}
                          </p>
                          <p className="text-sm text-gray-700">
                            {/* Show number of books */}
                            {quote.books?.length || 0} book
                            {quote.books?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <StatusBadge status={quote.status} />
                      </div>

                      {/* Show vendor business name if available */}
                      {quote.vendorDetails?.businessName && (
                        <p className="text-sm text-gray-700 mt-1">
                          From: {quote.vendorDetails.businessName}
                        </p>
                      )}

                      <p className="text-sm text-gray-700 mt-2">
                        Notes: {quote.notes || "N/A"}
                      </p>

                      {/* Show quote validity if available */}
                      {quote.quoteValidUntil && (
                        <p className="text-xs text-gray-700 mt-1">
                          Valid until:{" "}
                          {new Date(quote.quoteValidUntil).toLocaleDateString()}
                        </p>
                      )}

                      <div className="mt-2 text-xs text-gray-700">
                        Submitted:{" "}
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-900 text-center py-8">
                    {searchTerm || filterStatus !== "all"
                      ? "No matching quotes found."
                      : "You haven't submitted any quotes yet."}
                  </p>
                )}
              </div>
              {mySubmittedQuotes.length > 3 && (
                <div className="mt-4 text-center">
                  <Link
                    to="/quotes"
                    className="text-[#0B2E33] hover:underline text-sm"
                  >
                    View all quotes ({mySubmittedQuotes.length})
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Request Detail Modal */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default VendorDashboard;
