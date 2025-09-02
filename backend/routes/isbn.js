// routes/isbn.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ISBNdb API configuration
const ISBNDB_API_KEY = process.env.ISBNDB_API_KEY;
const ISBNDB_BASE_URL =
  process.env.ISBNDB_BASE_URL || "https://api.premium.isbndb.com";

// Proxy endpoint for ISBNdb API
router.get("/search", async (req, res) => {
  try {
    const { q, page = 1, pageSize = 10 } = req.query;

    if (!q || q.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 3 characters long",
      });
    }

    const response = await axios.get(
      `${ISBNDB_BASE_URL}/books/${encodeURIComponent(q)}`,
      {
        params: { page, pageSize },
        headers: {
          Authorization: ISBNDB_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      books: response.data.books || [],
    });
  } catch (error) {
    console.error("Book search error:", error.response?.data || error.message);

    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(401).json({
        success: false,
        message: "ISBNdb API authentication failed. Please check your API key.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error searching for books",
    });
  }
});

// Get book by ISBN
router.get("/isbn/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;

    if (!isbn) {
      return res.status(400).json({
        success: false,
        message: "ISBN is required",
      });
    }

    const cleanISBN = isbn.replace(/[^0-9X]/gi, "");

    const response = await axios.get(`${ISBNDB_BASE_URL}/book/${cleanISBN}`, {
      headers: {
        Authorization: ISBNDB_API_KEY,
        "Content-Type": "application/json",
      },
    });

    res.json({
      success: true,
      book: response.data.book || null,
    });
  } catch (error) {
    console.error("ISBN lookup error:", error.response?.data || error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Book not found for this ISBN",
      });
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(401).json({
        success: false,
        message: "ISBNdb API authentication failed. Please check your API key.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error looking up book by ISBN",
    });
  }
});
export default router;
