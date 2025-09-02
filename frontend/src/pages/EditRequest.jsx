import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { requestsAPI, isbnAPI } from "../services/api";
import { BookOpen, Plus, X, Loader, Search } from "lucide-react";

const EditRequest = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeBookIndex, setActiveBookIndex] = useState(null);
  const [searching, setSearching] = useState(false);

  // Fetch request data
  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const res = await requestsAPI.getById(requestId);
        const books = res?.data?.data?.request?.books || [];
        setBooks(books);
      } catch (err) {
        console.error(err);
        setError("Failed to load request data.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId]);

  // Debounce function for search
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Fetch book suggestions
  const fetchBookSuggestions = async (query, index, field) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setSearching(true);
    setActiveBookIndex(index);

    try {
      let results;
      if (field === "isbn") {
        const response = await isbnAPI.getBookByISBN(query);
        results = response.data.book ? [response.data.book] : [];
      } else {
        const response = await isbnAPI.searchBooks(query);
        results = response.data.books || [];
      }
      setSuggestions(results);
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(
      (query, index, field) => fetchBookSuggestions(query, index, field),
      500
    ),
    []
  );

  const handleChange = (index, field, value) => {
    const newBooks = [...books];
    newBooks[index][field] = value;
    setBooks(newBooks);

    // Clear suggestions and error
    setSuggestions([]);
    if (error) setError("");

    // Trigger search for title/isbn
    if ((field === "title" || field === "isbn") && value.length >= 3) {
      debouncedSearch(value, index, field);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const newBooks = [...books];
    newBooks[activeBookIndex] = {
      ...newBooks[activeBookIndex],
      title: suggestion.title || "",
      author: suggestion.authors
        ? Array.isArray(suggestion.authors)
          ? suggestion.authors.join(", ")
          : suggestion.authors
        : "",
      isbn: suggestion.isbn13 || suggestion.isbn10 || suggestion.isbn || "",
    };
    setBooks(newBooks);
    setSuggestions([]);
  };

  const handleAddBook = () => {
    setBooks([
      ...books,
      {
        title: "",
        author: "",
        isbn: "",
        condition: "new",
        quantity: 1,
        deadline: "",
        notes: "",
      },
    ]);
  };

  const handleRemoveBook = (index) => {
    setBooks(books.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSubmitMessage("");

    try {
      const res = await requestsAPI.updateRequest(requestId, { books });
      if (res.data.success) {
        setSubmitMessage("✅ Request updated successfully!");
        setTimeout(() => navigate("/my-requests"), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update request";
      setError(msg);
      setSubmitMessage(`❌ ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#14464b] text-white flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl bg-[#ffffff] rounded-2xl shadow-2xl p-6 md:p-8 border border-[#2a7d84]">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#007e77]">
          <BookOpen className="inline-block mr-3 h-8 w-8" />
          Edit Book Request
        </h2>

        {error && (
          <div className="p-4 mb-6 rounded-lg bg-red-900 text-red-200">
            {error}
          </div>
        )}

        {submitMessage && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              submitMessage.startsWith("❌")
                ? "bg-red-900 text-red-200"
                : "bg-green-900 text-green-200"
            }`}
          >
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {books.map((book, index) => (
            <div
              key={index}
              className="border border-[#2a7d84] rounded-xl p-5 md:p-6 space-y-5 relative bg-[#1e454a] bg-opacity-70"
            >
              <h3 className="text-xl font-semibold text-[#ffffff] flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Book {index + 1}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="relative suggestion-container">
                  <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={book.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] outline-none focus:ring-2 focus:ring-[#93B1B5]"
                    required
                  />
                  <Search className="absolute right-3 top-3.5 h-4 w-4 text-[#93B1B5]" />

                  {suggestions.length > 0 && activeBookIndex === index && (
                    <div className="absolute z-10 w-full mt-1 bg-[#fcffff] border border-[#3a7d84] rounded-lg shadow-lg max-h-60 overflow-auto">
                      {searching && (
                        <div className="p-3 text-center">
                          <Loader className="h-5 w-5 animate-spin mx-auto text-[#93B1B5]" />
                        </div>
                      )}
                      {suggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          className="p-3 hover:bg-[#d3f4f7] cursor-pointer border-b border-[#3a7d84] last:border-b-0"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="font-medium text-black">
                            {suggestion.title}
                          </div>
                          <div className="text-sm text-gray-700">
                            by{" "}
                            {suggestion.authors?.join(", ") || "Unknown Author"}
                          </div>
                          {suggestion.isbn && (
                            <div className="text-xs text-gray-600 mt-1">
                              ISBN:{" "}
                              {suggestion.isbn13 ||
                                suggestion.isbn10 ||
                                suggestion.isbn}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                    Author
                  </label>
                  <input
                    type="text"
                    value={book.author}
                    onChange={(e) =>
                      handleChange(index, "author", e.target.value)
                    }
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] outline-none focus:ring-2 focus:ring-[#93B1B5]"
                  />
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={book.isbn}
                    onChange={(e) =>
                      handleChange(index, "isbn", e.target.value)
                    }
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] outline-none focus:ring-2 focus:ring-[#93B1B5]"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={book.quantity}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] outline-none focus:ring-2 focus:ring-[#93B1B5]"
                  />
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                    Condition
                  </label>
                  <select
                    value={book.condition}
                    onChange={(e) =>
                      handleChange(index, "condition", e.target.value)
                    }
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] outline-none focus:ring-2 focus:ring-[#93B1B5]"
                  >
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={book.deadline}
                    onChange={(e) =>
                      handleChange(index, "deadline", e.target.value)
                    }
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] outline-none focus:ring-2 focus:ring-[#93B1B5]"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                    Notes
                  </label>
                  <textarea
                    value={book.notes}
                    onChange={(e) =>
                      handleChange(index, "notes", e.target.value)
                    }
                    rows="2"
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] outline-none focus:ring-2 focus:ring-[#93B1B5]"
                  />
                </div>
              </div>

              {/* Remove button */}
              {books.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveBook(index)}
                  className="absolute top-5 right-5 text-red-400 hover:text-red-300 bg-red-900 bg-opacity-30 p-2 rounded-lg"
                  aria-label="Remove book"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleAddBook}
              className="flex items-center space-x-2 bg-[#2a7d84] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#3a8d94] transition-all shadow-md w-full md:w-auto justify-center"
            >
              <Plus className="h-5 w-5" />
              <span>Add Another Book</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#3a8d94] px-6 py-2.5 rounded-xl font-semibold hover:bg-[#4a9da4] transition-all shadow-md text-white w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {saving ? (
                <>
                  <Loader className="h-5 w-5 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRequest;
