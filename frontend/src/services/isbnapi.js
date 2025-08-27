const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Search books through our backend API
 * @param {string} query - Search query (title, author, or ISBN)
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} Search results
 */
export const searchBooks = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/search?q=${encodeURIComponent(
        query
      )}&page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies if using session auth
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Search books error:", error);
    throw new Error(error.message || "Failed to search books");
  }
};

/**
 * Get book details by ISBN through our backend API
 * @param {string} isbn - ISBN number
 * @returns {Promise<Object>} Book details
 */
export const getBookByISBN = async (isbn) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/books/isbn/${encodeURIComponent(isbn)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get book by ISBN error:", error);
    throw new Error(error.message || "Failed to fetch book by ISBN");
  }
};

/**
 * Enhanced search with filters
 * @param {string} query - Search query
 * @param {Object} filters - Search filters
 * @param {number} page - Page number
 * @returns {Promise<Object>} Filtered search results
 */
export const searchBooksWithFilters = async (query, filters = {}, page = 1) => {
  try {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      ...filters,
    });

    const response = await fetch(`${API_BASE_URL}/books/search?${params}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Search books with filters error:", error);
    throw new Error(error.message || "Failed to search books with filters");
  }
};

/**
 * Get multiple books by their ISBNs
 * @param {string[]} isbns - Array of ISBN numbers
 * @returns {Promise<Object[]>} Array of book details
 */
export const getBooksByISBNs = async (isbns) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ isbns }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get books by ISBNs error:", error);
    throw new Error(error.message || "Failed to fetch books by ISBNs");
  }
};

// Optional: Add request cancellation support
let abortController = null;

export const cancelPendingRequests = () => {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
};

export const searchBooksWithAbort = async (query, page = 1) => {
  // Cancel any pending request
  cancelPendingRequests();

  abortController = new AbortController();

  try {
    const response = await fetch(
      `${API_BASE_URL}/books/search?q=${encodeURIComponent(
        query
      )}&page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: abortController.signal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Request was aborted");
      return null;
    }
    console.error("Search books error:", error);
    throw new Error(error.message || "Failed to search books");
  }
};

export default {
  searchBooks,
  getBookByISBN,
  searchBooksWithFilters,
  getBooksByISBNs,
  searchBooksWithAbort,
  cancelPendingRequests,
};
