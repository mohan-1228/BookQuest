import "dotenv/config";
import axios from "axios";

const ISBNDB_API_KEY = process.env.ISBNDB_API_KEY;
const ISBNDB_BASE_URL =
  process.env.ISBNDB_BASE_URL || "https://api2.isbndb.com";

// Helper function to handle API responses
const handleResponse = (response) => {
  if (response.status !== 200) {
    throw new Error(
      `ISBNdb API error: ${response.status} - ${response.statusText}`
    );
  }
  return response.data;
};

// Search books by query (title, author, or ISBN)
export const searchBooks = async (query, page = 1) => {
  try {
    const response = await axios.get(
      `${ISBNDB_BASE_URL}/books/${encodeURIComponent(query)}?page=${page}`,
      {
        headers: {
          Authorization: ISBNDB_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return handleResponse(response);
  } catch (error) {
    console.error("Search books error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to search books");
  }
};

// Get book by specific ISBN
export const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(
      `${ISBNDB_BASE_URL}/book/${encodeURIComponent(isbn)}`,
      {
        headers: {
          Authorization: ISBNDB_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return handleResponse(response);
  } catch (error) {
    console.error(
      "Get book by ISBN error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch book by ISBN"
    );
  }
};

export default { searchBooks, getBookByISBN };
