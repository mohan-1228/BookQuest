import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/authContext";
import { requestsAPI } from "../services/api";
import {
  Package,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  X,
  BookOpen,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const UserRequestsPage = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch user requests
  const fetchUserRequests = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setFetchError(null);

      const response = await requestsAPI.getMyRequests();
      const requestsData = response.data?.data || [];
      setRequests(requestsData);
    } catch (error) {
      console.error("Failed to fetch user requests:", error);
      setFetchError("Failed to load your requests. Please try again.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserRequests();
  }, [fetchUserRequests]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserRequests();
  };

  // Filter requests based on search term and status
  const filteredRequests = requests.filter((request) => {
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

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
  };

  const handleEditRequest = (requestId) => {
    navigate(`/edit-request/${requestId}`);
  };

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await requestsAPI.delete(requestToDelete._id);
      setRequests(requests.filter((req) => req._id !== requestToDelete._id));
      setShowDeleteConfirm(false);
      setRequestToDelete(null);

      // If we were viewing the deleted request, close the modal
      if (selectedRequest && selectedRequest._id === requestToDelete._id) {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Failed to delete request:", error);
      setFetchError("Failed to delete request. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setRequestToDelete(null);
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      open: {
        color: "bg-blue-100 text-blue-800",
        text: "Open",
        icon: <Clock className="h-3 w-3" />,
      },
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
      fulfilled: {
        color: "bg-green-100 text-green-800",
        text: "Fulfilled",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        text: "Cancelled",
        icon: <XCircle className="h-3 w-3" />,
      },
    };

    const config = statusConfig[status] || statusConfig.open;

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
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#1a4a52]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              My Book Requests
            </h1>
          </div>
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
            <Link
              to="/new-request"
              className="bg-[#0B2E33] text-white py-2 px-4 rounded-lg flex items-center hover:bg-[#0a2529] transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Request
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-[#0B2E33] focus:border-transparent text-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-800" />
              <select
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0B2E33] focus:border-transparent text-gray-800"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {filteredRequests.length > 0 ? (
            <div className="divide-y">
              {filteredRequests.map((request) => {
                const firstBook = request.books?.[0] || {};
                return (
                  <div
                    key={request._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {firstBook.title || "Untitled Book"}
                          {request.books?.length > 1 &&
                            ` + ${request.books.length - 1} more`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          by {firstBook.author || "Unknown Author"}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={request.status} />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="text-[#0B2E33] hover:text-[#0a2529] flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditRequest(request._id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(request)}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== "all"
                  ? "No matching requests found"
                  : "You haven't created any requests yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first book request"}
              </p>
              <Link
                to="/new-request"
                className="bg-[#0B2E33] text-white py-2 px-4 rounded-lg inline-flex items-center hover:bg-[#0a2529] transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Request
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-[#0B2E33] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Request Details
              </h2>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <StatusBadge status={selectedRequest.status} />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Books Requested
                    </h3>
                    <div className="space-y-4">
                      {selectedRequest.books?.map((book, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium text-gray-900">
                            {book.title || "Untitled Book"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            by {book.author || "Unknown Author"}
                          </p>
                          {book.isbn && (
                            <p className="text-sm text-gray-600 mt-1">
                              ISBN: {book.isbn}
                            </p>
                          )}
                          {book.edition && (
                            <p className="text-sm text-gray-600">
                              Edition: {book.edition}
                            </p>
                          )}
                          {book.condition && (
                            <p className="text-sm text-gray-600">
                              Condition: {book.condition}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedRequest.notes && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Additional Notes
                      </h3>
                      <p className="text-gray-700">{selectedRequest.notes}</p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Request Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Request ID</p>
                        <p className="text-gray-900 font-mono text-sm">
                          {selectedRequest._id}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Date Created</p>
                        <p className="text-gray-900">
                          {new Date(
                            selectedRequest.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="text-gray-900">
                          {new Date(
                            selectedRequest.updatedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Number of Books</p>
                        <p className="text-gray-900">
                          {selectedRequest.books?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quote Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Quotes Received</p>
                        <p className="text-gray-900">
                          {selectedRequest.quoteCount || 0}
                        </p>
                      </div>

                      <div>
                        <Link
                          to={`/request/${selectedRequest._id}/quotes`}
                          className="bg-[#0B2E33] text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-[#0a2529] transition-colors"
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          View Quotes
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col space-y-3">
                    <button
                      onClick={() => handleEditRequest(selectedRequest._id)}
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Request
                    </button>
                    <button
                      onClick={() => handleDeleteClick(selectedRequest)}
                      className="bg-red-100 text-red-700 hover:bg-red-200 py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this request? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRequestsPage;
