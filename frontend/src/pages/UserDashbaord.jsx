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

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [receivedQuotes, setReceivedQuotes] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    openRequests: 0,
    quotesReceived: 0,
    avgQuoteTime: "0h",
    pendingQuotes: 0,
    acceptedQuotes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
  const fetchUserData = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setFetchError(null);

      const [requestsResponse, quotesResponse] = await Promise.all([
        requestsAPI.getMyRequests(),
        quotesAPI.getUserQuotes(),
      ]);

      // Extract requests from the API response
      const myRequestsData = requestsResponse.data?.data || [];

      // Extract quotes from the API response
      const quotesData = quotesResponse.data?.data || quotesResponse.data || [];

      setMyRequests(myRequestsData);
      setReceivedQuotes(quotesData);

      // Calculate average quote response time
      const pendingQuotes = quotesData.filter(
        (q) => q.status === "pending"
      ).length;
      const acceptedQuotes = quotesData.filter(
        (q) => q.status === "accepted"
      ).length;

      // Calculate average quote response time
      const avgQuoteTime = calculateAvgQuoteTime(quotesData);

      setStats({
        totalRequests: myRequestsData.length,
        openRequests: myRequestsData.filter((r) => r.status === "open").length,
        quotesReceived: quotesData.length,
        avgQuoteTime,
        pendingQuotes,
        acceptedQuotes,
      });
    } catch (error) {
      console.error("Failed to fetch user dashboard data:", error);
      setFetchError("Failed to load user data. Please try again.");
      setMyRequests([]);
      setReceivedQuotes([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  // Calculate average quote response time function
  const calculateAvgQuoteTime = (quotes) => {
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
    fetchUserData();
  }, [fetchUserData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  // Filter requests based on search term and status
  const filteredRequests = myRequests.filter((request) => {
    // Search through all books in the request
    const hasMatchingBook = request.books?.some(
      (book) =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.includes(searchTerm)
    );

    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;

    return hasMatchingBook && matchesStatus;
  });

  // Filter quotes based on search term and status
  const filteredQuotes = receivedQuotes.filter((quote) => {
    const requestTitle = getNestedValue(quote, "requestId.title", "");
    const vendorName = getNestedValue(quote, "vendorId.businessName", "");

    const matchesSearch =
      requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || quote.status === filterStatus;

    return matchesSearch && matchesStatus;
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
                    {currentUser?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-gray-700">{currentUser?.name}</span>
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
                Welcome, {currentUser?.name || "User"}!
              </h2>
              <p className="mb-4 opacity-90">
                Track your book requests and received quotes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/my-requests"
                  className="inline-block bg-white text-[#0B2E33] hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-all duration-300"
                >
                  View My Requests
                </Link>
                <Link
                  to="/book-request"
                  className="inline-block border border-white text-white hover:bg-white hover:text-[#0B2E33] font-medium py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Create New Request
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
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-black">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalRequests}
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
                  <p className="text-sm text-black">Open Requests</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.openRequests}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-amber-100 text-amber-600 mr-4">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-black">Quotes Received</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.quotesReceived}
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
                  <p className="text-sm text-black">Avg. Quote Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.avgQuoteTime}
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
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">
                    {stats.quotesReceived -
                      stats.pendingQuotes -
                      stats.acceptedQuotes}
                  </p>
                  <p className="text-sm text-amber-800">Other</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-black">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/book-request"
                  className="bg-[#0B2E33] text-white text-center py-2 px-4 rounded-lg hover:bg-[#0a2529] transition-colors"
                >
                  New Request
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
            {/* My Recent Requests */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-black">
                  <Package className="h-5 w-5" />
                  My Recent Requests
                </h3>
                {/* <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-1">
                    <Search className="h-4 w-4 text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      className="bg-transparent text-sm outline-none w-32"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="bg-gray-800 text-sm rounded-lg px-2 py-1 outline-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div> */}
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
                            <Link
                              to={`/request/${request._id}`}
                              className="text-sm text-[#0B2E33] hover:underline flex items-center"
                            >
                              <Eye className="h-3 w-3 mr-1" /> View
                            </Link>
                            <Link
                              to={`/request/${request._id}/quotes`}
                              className="text-sm bg-[#0B2E33] text-white py-1 px-3 rounded-md hover:bg-[#0a2529] flex items-center"
                            >
                              <DollarSign className="h-3 w-3 mr-1" /> Quotes
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-900 text-center py-8">
                    {searchTerm || filterStatus !== "all"
                      ? "No matching requests found."
                      : "You haven't created any requests yet."}
                  </p>
                )}
              </div>
              {myRequests.length > 5 && (
                <div className="mt-4 text-center">
                  <Link
                    to="/my-requests"
                    className="text-[#0B2E33] hover:underline text-sm"
                  >
                    View all requests ({myRequests.length})
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Quotes Received */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-black">
                  <DollarSign className="h-5 w-5" />
                  Recent Quotes Received
                </h3>
                {/* <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-1">
                    <Search className="h-4 w-4 text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Search quotes..."
                      className="bg-transparent text-sm outline-none w-32"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="bg-gray-800 text-sm rounded-lg px-2 py-1 outline-none"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div> */}
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
                            {getNestedValue(
                              quote,
                              "requestId.title",
                              "Unknown Request"
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">
                            From:{" "}
                            {getNestedValue(
                              quote,
                              "vendorId.businessName",
                              "Unknown Vendor"
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            Price: ${quote.price}
                          </p>
                        </div>
                        <StatusBadge status={quote.status} />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Notes: {quote.notes || "N/A"}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        Submitted:{" "}
                        {new Date(
                          quote.createdAt || quote.submittedAt
                        ).toLocaleDateString()}
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <Link
                          to={`/quote/${quote._id}`}
                          className="text-sm text-[#0B2E33] hover:underline flex items-center"
                        >
                          <Eye className="h-3 w-3 mr-1" /> View Details
                        </Link>
                        {quote.status === "pending" && (
                          <button className="text-sm bg-[#0B2E33] text-white py-1 px-3 rounded-md hover:bg-[#0a2529] flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" /> Respond
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-900 text-center py-8">
                    {searchTerm || filterStatus !== "all"
                      ? "No matching quotes found."
                      : "No quotes received yet."}
                  </p>
                )}
              </div>
              {receivedQuotes.length > 3 && (
                <div className="mt-4 text-center">
                  <Link
                    to="/my-quotes"
                    className="text-[#0B2E33] hover:underline text-sm"
                  >
                    View all quotes ({receivedQuotes.length})
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserDashboard;
