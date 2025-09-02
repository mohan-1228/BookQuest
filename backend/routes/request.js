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

// PUT /api/requests/:id - Update a book request
router.put("/:id", auth, async (req, res) => {
  try {
    const { books, status } = req.body;

    // Find the request
    const request = await BookRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check if user owns the request or is admin
    if (
      request.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this request",
      });
    }

    // Update books if provided
    if (books) {
      // Validate books array
      if (!Array.isArray(books) || books.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Books must be a non-empty array",
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

      request.books = books.map((book) => ({
        ...book,
        quantity: Math.max(1, parseInt(book.quantity) || 1),
      }));
    }

    // Update status if provided and user is authorized
    if (status) {
      // Only allow status changes for request owner or admin
      if (
        request.userId.toString() === req.user.id ||
        req.user.role === "admin"
      ) {
        request.status = status;
      }
    }

    request.updatedAt = new Date();
    await request.save();

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/requests/:id - Partially update a book request
router.patch("/:id", auth, async (req, res) => {
  try {
    const { status, notes } = req.body;

    // Find the request
    const request = await BookRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check if user owns the request or is admin
    if (
      request.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this request",
      });
    }

    // Update status if provided
    if (
      status &&
      (request.userId.toString() === req.user.id || req.user.role === "admin")
    ) {
      request.status = status;
    }

    // Update notes if provided by request owner
    if (notes !== undefined && request.userId.toString() === req.user.id) {
      request.notes = notes;
    }

    request.updatedAt = new Date();
    await request.save();

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/requests/:id - Delete a book request
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find the request
    const request = await BookRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Check if user owns the request or is admin
    if (
      request.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this request",
      });
    }

    // Check if there are quotes for this request
    const quotesCount = await Quote.countDocuments({
      requestId: req.params.id,
    });

    if (quotesCount > 0 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete request that has quotes. Please contact admin.",
      });
    }

    // Delete all quotes associated with this request
    await Quote.deleteMany({ requestId: req.params.id });

    // Delete the request
    await BookRequest.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/requests/:requestId/quotes - Submit a quote for a request
// routes/requests.js - Update the quote submission route
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

    const { books, notes, estimatedDelivery } = req.body;

    // Validate books array
    if (!books || !Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Books array is required with pricing information",
      });
    }

    // Validate each book has required fields
    for (const book of books) {
      if (!book.bookId || !book.unitPrice || book.unitPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each book must have a valid bookId and unitPrice",
        });
      }
    }

    // Calculate total price
    const totalPrice = books.reduce(
      (total, book) => total + (book.totalPrice || 0),
      0
    );

    const quote = new Quote({
      books: books.map((book) => ({
        bookId: book.bookId,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        quantity: book.quantity,
        condition: book.condition,
        unitPrice: book.unitPrice,
        totalPrice: book.totalPrice,
      })),
      totalPrice,
      notes,
      estimatedDelivery,
      vendorId: req.user.id,
      requestId: req.params.requestId,
    });

    await quote.save();

    // Populate vendor information in the response
    await quote.populate("vendorId", "name email businessName");

    res.status(201).json({
      success: true,
      data: quote,
      message: "Quote submitted successfully",
    });
  } catch (error) {
    console.error("Quote submission error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
