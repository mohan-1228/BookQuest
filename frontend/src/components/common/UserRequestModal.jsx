import React from "react";
import {
  X,
  BookOpen,
  Book,
  Hash,
  DollarSign,
  Calendar,
  FileText,
  User,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    open: {
      color: "bg-blue-100 text-blue-800",
      text: "Open",
    },
    pending: {
      color: "bg-amber-100 text-amber-800",
      text: "Pending",
    },
    accepted: {
      color: "bg-green-100 text-green-800",
      text: "Accepted",
    },
    rejected: {
      color: "bg-red-100 text-red-800",
      text: "Rejected",
    },
    fulfilled: {
      color: "bg-green-100 text-green-800",
      text: "Fulfilled",
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      text: "Cancelled",
    },
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

const UserRequestModal = ({ request, isOpen, onClose }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-[#0B2E33] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <StatusBadge status={request.status} />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Books Requested
                </h3>
                <div className="space-y-4">
                  {request.books?.map((book, index) => (
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
                      {book.quantity && (
                        <p className="text-sm text-gray-600">
                          Quantity: {book.quantity}
                        </p>
                      )}
                      {book.deadline && (
                        <p className="text-sm text-gray-600">
                          Deadline:{" "}
                          {new Date(book.deadline).toLocaleDateString()}
                        </p>
                      )}
                      {book.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Notes:</span>{" "}
                          {book.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {request.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Additional Notes
                  </h3>
                  <p className="text-gray-700">{request.notes}</p>
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
                      {request._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Date Created</p>
                    <p className="text-gray-900">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-900">
                      {new Date(request.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Number of Books</p>
                    <p className="text-gray-900">
                      {request.books?.length || 0}
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
                    <p className="text-gray-900">{request.quoteCount || 0}</p>
                  </div>

                  <div>
                    <Link
                      to={`/request/${request._id}/quotes`}
                      className="bg-[#0B2E33] text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-[#0a2529] transition-colors"
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      View Quotes
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRequestModal;
