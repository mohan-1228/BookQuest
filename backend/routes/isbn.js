// routes/isbn.js
import express from "express";
import axios from "axios";
import "dotenv/config";

const router = express.Router();

// ISBNdb API configuration
const ISBNDB_API_KEY = process.env.ISBNDB_API_KEY;
// Use the appropriate base URL based on your subscription
const ISBNDB_BASE_URL =
  process.env.ISBNDB_BASE_URL || "https://api2.isbndb.com";

// Validate ISBN format
const isValidISBN = (isbn) => {
  const cleanedISBN = isbn.replace(/-/g, "");
  return cleanedISBN.length === 10 || cleanedISBN.length === 13;
};

// Get book details by ISBN
router.get("/book/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;

    // Validate ISBN format
    if (!isValidISBN(isbn)) {
      return res.status(400).json({
        error: "Invalid ISBN format",
        message: "ISBN must be 10 or 13 digits (hyphens allowed)",
      });
    }

    const response = await axios.get(`${ISBNDB_BASE_URL}/book/${isbn}`, {
      headers: {
        Authorization: ISBNDB_API_KEY,
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("ISBN API error:", error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({
        error: "Book not found",
        message: "No book found with the provided ISBN",
      });
    }

    if (error.response?.status === 401) {
      return res.status(500).json({
        error: "API authentication failed",
        message: "Invalid ISBNdb API key",
      });
    }

    res.status(500).json({
      error: "Failed to fetch book details",
      message: error.response?.data?.message || error.message,
    });
  }
});

// Search books by title, author, or keyword
router.get("/books/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, pageSize = 5 } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        error: "Invalid query",
        message: "Search query must be at least 2 characters long",
      });
    }

    const response = await axios.get(
      `${ISBNDB_BASE_URL}/books/${query}?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: ISBNDB_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("ISBN API error:", error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({
        error: "No books found",
        message: "No books found matching your search criteria",
      });
    }

    if (error.response?.status === 401) {
      return res.status(500).json({
        error: "API authentication failed",
        message: "Invalid ISBNdb API key",
      });
    }

    res.status(500).json({
      error: "Failed to search books",
      message: error.response?.data?.message || error.message,
    });
  }
});

// Search books by multiple ISBNs (POST method)
router.post("/books/bulk", async (req, res) => {
  try {
    const { isbns } = req.body;

    if (!isbns || !Array.isArray(isbns) || isbns.length === 0) {
      return res.status(400).json({
        error: "Invalid request",
        message: "Please provide an array of ISBNs",
      });
    }

    // Validate each ISBN
    for (const isbn of isbns) {
      if (!isValidISBN(isbn)) {
        return res.status(400).json({
          error: "Invalid ISBN format",
          message: `ISBN ${isbn} must be 10 or 13 digits (hyphens allowed)`,
        });
      }
    }

    const response = await axios.post(
      `${ISBNDB_BASE_URL}/books`,
      `isbns=${isbns.join(",")}`,
      {
        headers: {
          Authorization: ISBNDB_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("ISBN API error:", error.message);

    if (error.response?.status === 401) {
      return res.status(500).json({
        error: "API authentication failed",
        message: "Invalid ISBNdb API key",
      });
    }

    res.status(500).json({
      error: "Failed to fetch book details",
      message: error.response?.data?.message || error.message,
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ISBN API is working",
    baseUrl: ISBNDB_BASE_URL,
  });
});

export default router;
