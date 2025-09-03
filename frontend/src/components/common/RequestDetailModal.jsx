import React from "react";
import { X, BookOpen, Book, Hash, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    quoted: "bg-blue-100 text-blue-800",
    // Add more statuses as needed
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

const RequestDetailModal = ({ request, isOpen, onClose }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-[#0B2E33] bg-opacity-90 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto text-black">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white text-black">
          <h3 className="text-xl font-semibold text-gray-900">
            Request Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-800 hover:text-gray-500"
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
                Request #{request._id.substring(0, 8)}
              </h4>
              <p className="text-sm text-gray-500">
                {request.books?.length || 0} book
                {request.books?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-1">Status</h5>
              <StatusBadge status={request.status} />
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-1">
                Date Created
              </h5>
              <p className="text-sm text-gray-900">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-1">
                Requester
              </h5>
              <p className="text-sm text-gray-900">
                {request.userId?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-900">
                {request.userId?.email || ""}
              </p>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-3">
              Books Requested
            </h5>
            <div className="space-y-3">
              {request.books?.map((book, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <Book className="h-5 w-5 text-gray-900" />
                    </div>
                    <div className="flex-1">
                      <h6 className="text-sm font-medium text-gray-900">
                        {book.title || "Untitled Book"}
                      </h6>
                      {book.author && (
                        <p className="text-xs text-gray-900">
                          by {book.author}
                        </p>
                      )}
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-900">
                        {book.isbn && (
                          <div className="flex items-center">
                            <Hash className="h-3 w-3 mr-1" />
                            <span>{book.isbn}</span>
                          </div>
                        )}
                        {book.condition && (
                          <div>
                            Condition:{" "}
                            <span className="capitalize">{book.condition}</span>
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
                              {new Date(book.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      {book.notes && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-900">
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
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Close
          </button>
          <Link
            to={`/requests/${request._id}/submit-quote`}
            className="px-4 py-2 bg-[#0B2E33] text-white rounded-md text-sm font-medium hover:bg-[#0a2529] flex items-center"
          >
            <DollarSign className="h-4 w-4 mr-1" /> Quote This Request
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;
