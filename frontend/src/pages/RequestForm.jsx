import React, { useState, useEffect } from "react";
import { requestsAPI, isbnAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Plus, X, Loader } from "lucide-react";

const BookRequestForm = () => {
  const [books, setBooks] = useState([
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeBookIndex, setActiveBookIndex] = useState(0);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Fetch book suggestions from our backend API
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
        // Search by ISBN
        try {
          const response = await isbnAPI.getBookByISBN(query);
          results = response.book ? [response.book] : [];
        } catch (error) {
          // If ISBN search fails, try a general search as fallback
          if (error.message.includes("not found")) {
            const searchResponse = await isbnAPI.searchBooks(query);
            results = searchResponse.books || [];
          } else {
            throw error;
          }
        }
      } else {
        // Search by title or other query
        const response = await isbnAPI.searchBooks(query);
        results = response.books || [];
      }

      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching book data:", error);

      // Don't show error for empty results, just clear suggestions
      if (
        error.message.includes("not found") ||
        error.message.includes("No books") ||
        error.message.includes("Invalid")
      ) {
        setSuggestions([]);
      } else if (error.message.includes("authentication")) {
        setError("API authentication failed. Please check your API key.");
      } else {
        setError("Could not fetch book suggestions. Please try again.");
      }

      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  };

  // Debounced version of the search function
  const debouncedSearch = React.useCallback(
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

    // Clear suggestions when input is cleared
    if (value.length === 0) {
      setSuggestions([]);
      return;
    }

    // Trigger search when title or ISBN is typed
    if ((field === "title" || field === "isbn") && value.length >= 3) {
      debouncedSearch(value, index, field);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const newBooks = [...books];
    newBooks[activeBookIndex] = {
      ...newBooks[activeBookIndex],
      title: suggestion.title || "",
      author: suggestion.authors ? suggestion.authors.join(", ") : "",
      isbn: suggestion.isbn || suggestion.isbn13 || suggestion.isbn10 || "",
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
    const newBooks = books.filter((_, i) => i !== index);
    setBooks(newBooks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitMessage("");

    try {
      const response = await requestsAPI.create({ books });
      if (response.data.success) {
        setSubmitMessage("✅ Book request submitted successfully!");
        setTimeout(() => {
          navigate("/my-requests");
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong!";
      setError(msg);
      setSubmitMessage(`❌ Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".suggestion-container")) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#14464b] text-white flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl bg-[#ffffff] rounded-2xl shadow-2xl p-6 md:p-8 border border-[#2a7d84]">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#007e77]">
          <BookOpen className="inline-block mr-3 h-8 w-8" />
          Request Books
        </h2>

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
                {/* Title with search functionality */}
                <div className="relative suggestion-container">
                  <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                    Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter book title"
                      value={book.title}
                      onChange={(e) =>
                        handleChange(index, "title", e.target.value)
                      }
                      className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] focus:ring-2 focus:ring-[#93B1B5] focus:border-transparent outline-none pr-10"
                      required
                    />
                    <Search className="absolute right-3 top-3.5 h-4 w-4 text-[#93B1B5]" />
                  </div>

                  {/* Suggestions dropdown */}
                  {suggestions.length > 0 && activeBookIndex === index && (
                    <div className="absolute z-10 w-full mt-1 bg-[#161919] border border-[#3a7d84] rounded-lg shadow-lg max-h-60 overflow-auto">
                      {searching && (
                        <div className="p-3 text-center">
                          <Loader className="h-5 w-5 animate-spin mx-auto text-[#93B1B5]" />
                        </div>
                      )}
                      {suggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          className="p-3 hover:bg-[#3a7d84] cursor-pointer border-b border-[#3a7d84] last:border-b-0"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="font-medium text-white">
                            {suggestion.title}
                          </div>
                          <div className="text-sm text-[#93B1B5]">
                            by{" "}
                            {suggestion.authors?.join(", ") || "Unknown Author"}
                          </div>
                          {suggestion.isbn && (
                            <div className="text-xs text-[#B8E3E9] mt-1">
                              ISBN: {suggestion.isbn}
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
                    placeholder="Enter author name"
                    value={book.author}
                    onChange={(e) =>
                      handleChange(index, "author", e.target.value)
                    }
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] focus:ring-2 focus:ring-[#93B1B5] focus:border-transparent outline-none"
                  />
                </div>

                {/* ISBN with search functionality */}
                <div className="relative suggestion-container">
                  <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                    ISBN
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter ISBN number"
                      value={book.isbn}
                      onChange={(e) =>
                        handleChange(index, "isbn", e.target.value)
                      }
                      className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] focus:ring-2 focus:ring-[#93B1B5] focus:border-transparent outline-none pr-10"
                    />
                    <Search className="absolute right-3 top-3.5 h-4 w-4 text-[#93B1B5]" />
                  </div>
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
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] focus:ring-2 focus:ring-[#93B1B5] focus:border-transparent outline-none"
                  >
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={book.quantity}
                    min="1"
                    onChange={(e) =>
                      handleChange(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] focus:ring-2 focus:ring-[#93B1B5] focus:border-transparent outline-none"
                  />
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
                    className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] focus:ring-2 focus:ring-[#93B1B5] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#B8E3E9]">
                  Notes
                </label>
                <textarea
                  placeholder="Any additional notes about this book request"
                  value={book.notes}
                  onChange={(e) => handleChange(index, "notes", e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#2a4d52] border border-[#3a7d84] focus:ring-2 focus:ring-[#93B1B5] focus:border-transparent outline-none"
                  rows="2"
                />
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
              disabled={loading}
              className="bg-[#3a8d94] px-6 py-2.5 rounded-xl font-semibold hover:bg-[#4a9da4] transition-all shadow-md text-white w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-[#000000]">
          <p> Start typing a book title or ISBN to see suggestions</p>
          <p className="mt-1 text-xs">Powered by ISBNdb API</p>
        </div>
      </div>
    </div>
  );
};

export default BookRequestForm;
