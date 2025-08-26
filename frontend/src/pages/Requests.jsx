import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { requestsAPI } from "../services/api";
import {
  Search,
  Filter,
  Eye,
  DollarSign,
  Calendar,
  BookOpen,
  User,
  Hash,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
  Book,
} from "lucide-react";
import { Link } from "react-router-dom";

const VendorRequests = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch requests data
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const response = await requestsAPI.getAll();

        // Extract requests from the API response
        const requestsData = response.data?.data || [];

        console.log("Processed requests data:", requestsData);

        setRequests(requestsData);
        setFilteredRequests(requestsData);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError("Failed to load requests. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = requests;

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((request) => {
        // Search through all books in the request
        const hasMatchingBook = request.books?.some(
          (book) =>
            book.title?.toLowerCase().includes(lowerSearchTerm) ||
            book.author?.toLowerCase().includes(lowerSearchTerm) ||
            book.isbn?.includes(searchTerm)
        );

        // Also search by requester name
        const requesterName = request.userId?.name?.toLowerCase() || "";
        const matchesRequester = requesterName.includes(lowerSearchTerm);

        return hasMatchingBook || matchesRequester;
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((request) => request.status === statusFilter);
    }

    // Apply sorting
    result = result.sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredRequests(result);
  }, [requests, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      open: { color: "bg-blue-100 text-blue-800", text: "Open" },
      pending: { color: "bg-amber-100 text-amber-800", text: "Pending" },
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2E33]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#0B2E33] text-white py-2 px-4 rounded-lg"
          >
            Try Again
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
          <div className="flex justify-between items-center">
            {/* <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Book Requests
              </h1>
              <p className="text-sm text-gray-500">
                Find and quote on available book requests
              </p>
            </div> */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B8E3E9] to-[#93B1B5] flex items-center justify-center">
                  <span className="text-[#0B2E33] font-semibold text-sm">
                    {currentUser?.businessName?.charAt(0) ||
                      currentUser?.name?.charAt(0) ||
                      "V"}
                  </span>
                </div>
                <span className="text-gray-700 hidden sm:block">
                  {currentUser?.businessName || currentUser?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              All Requests
            </h2>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </button>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-[#0B2E33] focus:border-[#0B2E33]  text-gray-950"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#0B2E33] focus:border-[#0B2E33] text-gray-950"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#0B2E33] focus:border-[#0B2E33]  text-gray-950"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="createdAt">Date Created</option>
                  <option value="title">Title (First Book)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">Sort:</span>
              <button
                onClick={() => handleSort("createdAt")}
                className={`px-2 py-1 rounded ${
                  sortField === "createdAt"
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
              >
                Date{" "}
                {sortField === "createdAt" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Books
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-[#B8E3E9] to-[#93B1B5] rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-[#0B2E33]" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              Request #{request._id.substring(0, 8)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.books?.length || 0} book
                              {request.books?.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          {request.books?.slice(0, 2).map((book, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {book.title || "Untitled"}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center">
                                {book.author && (
                                  <span className="truncate">
                                    {book.author}
                                  </span>
                                )}
                                {book.isbn && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <Hash className="h-3 w-3 mr-1 inline" />
                                    <span>{book.isbn}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                          {request.books?.length > 2 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{request.books.length - 2} more books
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm text-gray-900">
                              {request.userId?.name || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {request.userId?.email || ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-[#0B2E33] hover:text-[#0a2529] flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </button>
                          <Link
                            to={`/request/${request._id}/quote`}
                            className="bg-[#0B2E33] text-white hover:bg-[#0a2529] py-1 px-3 rounded-lg flex items-center"
                          >
                            <DollarSign className="h-4 w-4 mr-1" /> Quote
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No requests found
                        </h3>
                        <p className="text-gray-500">
                          {searchTerm || statusFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "There are no book requests available at the moment"}
                        </p>
                        {(searchTerm || statusFilter !== "all") && (
                          <button
                            onClick={clearFilters}
                            className="mt-4 text-[#0B2E33] hover:text-[#0a2529] font-medium"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div key={request._id} className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-[#B8E3E9] to-[#93B1B5] rounded-lg flex items-center justify-center mr-2">
                          <BookOpen className="h-5 w-5 text-[#0B2E33]" />
                        </div>
                        <span className="text-xs text-gray-500">
                          Request #{request._id.substring(0, 8)}
                        </span>
                      </div>

                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        {request.books?.[0]?.title || "Untitled Book"}
                      </h3>

                      {request.books?.[0]?.author && (
                        <p className="text-sm text-gray-500 mb-1">
                          {request.books[0].author}
                        </p>
                      )}

                      <div className="flex items-center text-xs text-gray-400 mb-2">
                        {request.books?.[0]?.isbn && (
                          <>
                            <Hash className="h-3 w-3 mr-1" />
                            <span>{request.books[0].isbn}</span>
                          </>
                        )}
                        {request.books?.length > 1 && (
                          <span className="ml-2">
                            +{request.books.length - 1} more books
                          </span>
                        )}
                      </div>

                      <div className="flex items-center mt-2">
                        <div className="flex-shrink-0 h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                          <User className="h-3 w-3 text-gray-600" />
                        </div>
                        <span className="text-xs text-gray-600">
                          {request.userId?.name || "Unknown"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-[#0B2E33] hover:text-[#0a2529] text-sm flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </button>
                    <Link
                      to={`/request/${request._id}/quote`}
                      className="bg-[#0B2E33] text-white hover:bg-[#0a2529] py-1 px-3 rounded-lg text-sm flex items-center"
                    >
                      <DollarSign className="h-4 w-4 mr-1" /> Quote
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No requests found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "There are no book requests available at the moment"}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="text-[#0B2E33] hover:text-[#0a2529] font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Request Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-[#0B2E33] bg-opacity-90 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900">
                  Request Details
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-r from-[#B8E3E9] to-[#93B1B5] rounded-lg flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-[#0B2E33]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      Request #{selectedRequest._id.substring(0, 8)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedRequest.books?.length || 0} book
                      {selectedRequest.books?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      Status
                    </h5>
                    <StatusBadge status={selectedRequest.status} />
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      Date Created
                    </h5>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      Requester
                    </h5>
                    <p className="text-sm text-gray-900">
                      {selectedRequest.userId?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedRequest.userId?.email || ""}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">
                    Books Requested
                  </h5>
                  <div className="space-y-3">
                    {selectedRequest.books?.map((book, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Book className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <h6 className="text-sm font-medium text-gray-900">
                              {book.title || "Untitled Book"}
                            </h6>
                            {book.author && (
                              <p className="text-xs text-gray-600">
                                by {book.author}
                              </p>
                            )}
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                              {book.isbn && (
                                <div className="flex items-center">
                                  <Hash className="h-3 w-3 mr-1" />
                                  <span>{book.isbn}</span>
                                </div>
                              )}
                              {book.condition && (
                                <div>
                                  Condition:{" "}
                                  <span className="capitalize">
                                    {book.condition}
                                  </span>
                                </div>
                              )}
                              {book.quantity && (
                                <div>
                                  Quantity: <span>{book.quantity}</span>
                                </div>
                              )}
                              {book.deadline && (
                                <div>
                                  Deadline:{" "}
                                  <span>
                                    {new Date(
                                      book.deadline
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                            {book.notes && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">
                                  <span className="font-medium">Notes:</span>{" "}
                                  {book.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <Link
                  to={`/request/${selectedRequest._id}/quote`}
                  className="px-4 py-2 bg-[#0B2E33] text-white rounded-md text-sm font-medium hover:bg-[#0a2529] flex items-center"
                >
                  <DollarSign className="h-4 w-4 mr-1" /> Quote This Request
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorRequests;
