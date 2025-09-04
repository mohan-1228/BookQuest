import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/authContext";
import { quotesAPI, requestsAPI } from "../services/api";
import {
  Eye,
  DollarSign,
  CheckCircle,
  Contact,
  XCircle,
  Package,
  BookOpen,
  User,
  Mail,
  Calendar,
  Clock,
  ArrowLeft,
  Filter,
  Search,
  AlertCircle,
  RefreshCw,
  Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AvailableQuotes = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to get nested properties safely - MOVED TO TOP
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

  // Fetch user quotes
  const fetchUserQuotes = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setFetchError(null);

      const response = await quotesAPI.getUserQuotes();
      const quotesData = response.data?.data || response.data || [];
      //   console.log("Quotes data:", quotesData);

      // Sort quotes by creation date (newest first)
      const sortedQuotes = quotesData.sort(
        (a, b) =>
          new Date(b.createdAt || b.submittedAt) -
          new Date(a.createdAt || a.submittedAt)
      );

      setQuotes(sortedQuotes);
    } catch (error) {
      console.error("Failed to fetch user quotes:", error);
      setFetchError("Failed to load your quotes. Please try again.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserQuotes();
  }, [fetchUserQuotes]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserQuotes();
  };

  // Filter quotes based on status and search term
  const filteredQuotes = quotes.filter((quote) => {
    const matchesStatus =
      filterStatus === "all" || quote.status === filterStatus;

    // Search by vendor name, request title, or book title
    const searchLower = searchTerm.toLowerCase();
    const hasMatchingVendor = getNestedValue(quote, "vendorId.businessName", "")
      .toLowerCase()
      .includes(searchLower);
    const hasMatchingRequest = getNestedValue(quote, "requestId.title", "")
      .toLowerCase()
      .includes(searchLower);
    const hasMatchingBook = quote.books?.some(
      (book) =>
        book.title?.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower)
    );

    return (
      matchesStatus &&
      (hasMatchingVendor || hasMatchingRequest || hasMatchingBook)
    );
  });

  // Handle quote response (accept/reject)
  const handleQuoteResponse = async (quoteId, status) => {
    try {
      await quotesAPI.respondToQuote(quoteId, { status });

      // Update local state
      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote._id === quoteId ? { ...quote, status } : quote
        )
      );

      // If we're viewing the quote, update it
      if (selectedQuote && selectedQuote._id === quoteId) {
        setSelectedQuote({ ...selectedQuote, status });
      }

      // Show success message
      alert(
        `Quote ${status === "accepted" ? "accepted" : "rejected"} successfully!`
      );
    } catch (error) {
      console.error("Failed to respond to quote:", error);
      alert("Failed to respond to quote. Please try again.");
    }
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        color: "bg-amber-100 text-amber-800",
        text: "Pending",
        icon: <Clock className="h-3 w-3" />,
      },
      accepted: {
        color: "bg-green-100 text-green-800",
        text: "Accepted",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        text: "Rejected",
        icon: <XCircle className="h-3 w-3" />,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${config.color}`}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#1a4a52]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Available Quotes
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                title="Refresh quotes"
              >
                <RefreshCw
                  className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-4 mb-6 text-black">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by vendor, request, or book..."
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#0B2E33] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B2E33] focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quotes List */}
        <div className="space-y-6">
          {filteredQuotes.length > 0 ? (
            filteredQuotes.map((quote) => {
              const vendorName = getNestedValue(
                quote,
                "vendorDetails.businessName",
                "Unknown Vendor"
              );
              const contactPerson = getNestedValue(
                quote,
                "vendorDetails.contactPerson",
                "No contact person"
              );
              const vendorEmail = getNestedValue(
                quote,
                "vendorId.email",
                "No email"
              );
              const requestTitle = getNestedValue(
                quote,
                "requestId.title",
                "Unknown Request"
              );

              return (
                <div
                  key={quote._id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {/* Quote Header */}
                  <div className="p-6 border-b">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Quote for: {quote.requestId?._id?.substring(0, 8)}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Request ID:{" "}
                          {quote.requestId?._id?.substring(0, 8) || "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StatusBadge status={quote.status} />
                        <button
                          onClick={() =>
                            setSelectedQuote(
                              selectedQuote?._id === quote._id ? null : quote
                            )
                          }
                          className="text-[#0B2E33] hover:text-[#0a2529] flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {selectedQuote?._id === quote._id
                            ? "Hide"
                            : "View"}{" "}
                          Details
                        </button>
                      </div>
                    </div>

                    {/* Vendor Info */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          Vendor Information
                        </p>
                        <p className="text-sm text-gray-800 flex items-center">
                          <Store className="h-3 w-3 mr-1" />
                          Company Name: {vendorName}
                        </p>
                        <p className="text-sm text-gray-800 flex items-center">
                          <Contact className="h-3 w-3 mr-1" />
                          Contact Person: {contactPerson}
                        </p>
                        <p className="text-sm text-gray-800 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          Contact Email: {vendorEmail}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          Quote Details
                        </p>
                        <p className="text-gray-900">
                          Grand Total: $
                          {(quote.totalPrice || quote.price || 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Submitted:{" "}
                          {new Date(
                            quote.createdAt || quote.submittedAt
                          ).toLocaleDateString()}
                        </p>
                        {quote.quoteValidUntil && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Valid until:{" "}
                            {new Date(
                              quote.quoteValidUntil
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons for Pending Quotes */}
                    {quote.status === "pending" && (
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() =>
                            handleQuoteResponse(quote._id, "accepted")
                          }
                          className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept Quote
                        </button>
                        <button
                          onClick={() =>
                            handleQuoteResponse(quote._id, "rejected")
                          }
                          className="bg-red-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject Quote
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expanded Quote Details */}
                  {selectedQuote?._id === quote._id && (
                    <div className="p-6 bg-gray-300">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Quote Details
                      </h3>

                      {/* Books in Quote */}
                      <div className="mb-6">
                        {/* <h4 className="text-md font-medium text-gray-900 mb-3">
                          Books Quoted
                        </h4> */}
                        <div className="space-y-4">
                          {quote.books?.map((book, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 bg-white"
                            >
                              <h5 className="font-medium text-gray-900">
                                {book.title || "Untitled Book"}
                              </h5>
                              <p className="text-sm text-gray-600">
                                by {book.author || "Unknown Author"}
                              </p>

                              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                {book.isbn && (
                                  <div>
                                    <span className="font-medium">ISBN:</span>{" "}
                                    {book.isbn}
                                  </div>
                                )}
                                {book.condition && (
                                  <div>
                                    <span className="font-medium">
                                      Condition:
                                    </span>{" "}
                                    {book.condition}
                                  </div>
                                )}
                                {book.quantity && (
                                  <div>
                                    <span className="font-medium">
                                      Quantity:
                                    </span>{" "}
                                    {book.quantity}
                                  </div>
                                )}
                                {book.unitPrice && (
                                  <div>
                                    <span className="font-medium">
                                      Unit Price:
                                    </span>{" "}
                                    ${book.unitPrice.toFixed(2)}
                                  </div>
                                )}
                                {book.totalPrice && (
                                  <div>
                                    <span className="font-medium text-black">
                                      Total Price:
                                    </span>{" "}
                                    ${book.totalPrice.toFixed(2)}
                                  </div>
                                )}
                              </div>

                              {book.notes && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Notes:</span>{" "}
                                    {book.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Additional Quote Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="text-md font-medium text-gray-900 mb-3">
                            Quote Summary
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-900">
                                $
                                {(
                                  quote.subtotal ||
                                  quote.totalPrice ||
                                  0
                                ).toFixed(2)}
                              </span>
                            </div>
                            {quote.shippingCost && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="text-gray-900">
                                  ${quote.shippingCost.toFixed(2)}
                                </span>
                              </div>
                            )}
                            {quote.taxAmount && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tax:</span>
                                <span className="text-gray-900">
                                  ${quote.taxAmount.toFixed(2)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between border-t pt-2 mt-2">
                              <span className="text-gray-900 font-medium">
                                Grand Total:
                              </span>
                              <span className="text-gray-900 font-medium">
                                ${(quote.totalPrice || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4">
                          <h4 className="text-md font-medium text-gray-900 mb-3">
                            Vendor Notes
                          </h4>
                          <p className="text-sm text-gray-600">
                            {quote.notes || "No additional notes provided."}
                          </p>

                          {quote.quoteValidUntil && (
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                              <p className="text-sm text-amber-800 flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                This quote is valid until{" "}
                                {new Date(
                                  quote.quoteValidUntil
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== "all"
                  ? "No matching quotes found"
                  : "No quotes available yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Quotes from vendors will appear here once they respond to your requests"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableQuotes;
