import express from "express";
import BookRequest from "../models/BookRequest.js";
import Quote from "../models/Ouote.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/requests - Get ALL open requests (For vendors)
router.get("/", auth, async (req, res) => {
  try {
    const requests = await BookRequest.find({ status: "open" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/requests/my-requests - Get logged-in user's requests
router.get("/my-requests", auth, async (req, res) => {
  try {
    const requests = await BookRequest.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/requests/:id - Get single request with its quotes
// GET /api/requests/:id - Get single request with its quotes
router.get("/:id", auth, async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    const quotes = await Quote.find({ requestId: req.params.id }).populate(
      "vendorId",
      "name email businessName"
    );

    res.json({ success: true, data: { request, quotes } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/requests - Create a new book request
// POST /api/requests - Create a new book request (with multiple books)
router.post("/", auth, async (req, res) => {
  try {
    const { books } = req.body;

    // Validate that books array exists and has at least one book
    if (!books || !Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Books array is required with at least one book",
      });
    }

    // Validate each book
    for (const book of books) {
      if (!book.title) {
        return res.status(400).json({
          success: false,
          message: "Each book must have a title",
        });
      }
    }

    const request = new BookRequest({
      books: books.map((book) => ({
        ...book,
        quantity: Math.max(1, parseInt(book.quantity) || 1),
      })),
      userId: req.user.id,
    });

    await request.save();
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/requests/:requestId/quotes - Submit a quote for a request
router.post("/:requestId/quotes", auth, async (req, res) => {
  try {
    // Check if user is a vendor
    if (req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ success: false, message: "Only vendors can submit quotes" });
    }

    const request = await BookRequest.findById(req.params.requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (request.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This request is no longer open for quotes",
      });
    }

    const quote = new Quote({
      price: req.body.price,
      notes: req.body.notes,
      vendorId: req.user.id,
      requestId: req.params.requestId,
    });

    await quote.save();
    res.status(201).json({ success: true, data: quote });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
