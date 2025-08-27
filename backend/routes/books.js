import express from "express";
import { searchBooks, getBookByISBN } from "../services/isbndb.js";
const router = express.Router();

// Search books route
router.get("/search", async (req, res) => {
  try {
    const { q, page = 1 } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const results = await searchBooks(q, parseInt(page));
    res.json(results);
  } catch (error) {
    console.error("Book search error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get book by ISBN route
router.get("/isbn/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;

    if (!isbn) {
      return res.status(400).json({ error: "ISBN parameter is required" });
    }

    const book = await getBookByISBN(isbn);
    res.json(book);
  } catch (error) {
    console.error("Get book by ISBN error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
