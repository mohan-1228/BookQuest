import express from "express";
import Quote from "../models/Ouote.js";
import auth from "../middleware/auth.js";
import BookRequest from "../models/BookRequest.js";

const router = express.Router();

router.get("/users/my-quotes", auth, async (req, res) => {
  try {
    // Get all requests created by this user
    const userRequests = await BookRequest.find({ userId: req.user.id });
    const requestIds = userRequests.map((req) => req._id);

    // Get all quotes for these requests
    const quotes = await Quote.find({ requestId: { $in: requestIds } })
      .populate("vendorId", "name email businessName")
      .populate("requestId", "title author")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: quotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/quotes/my-quotes - Get quotes submitted by logged-in vendor
router.get("/my-quotes", auth, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const quotes = await Quote.find({ vendorId: req.user.id })
      .populate("requestId", "title author status")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: quotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Accept a quote
router.put("/:id/accept", auth, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate("requestId");

    if (!quote) {
      return res
        .status(404)
        .json({ success: false, message: "Quote not found" });
    }

    // Check if the current user owns the request
    if (quote.requestId.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    quote.status = "accepted";
    await quote.save();

    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Reject a quote
router.put("/:id/reject", auth, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate("requestId");

    if (!quote) {
      return res
        .status(404)
        .json({ success: false, message: "Quote not found" });
    }

    // Check if the current user owns the request
    if (quote.requestId.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    quote.status = "rejected";
    await quote.save();

    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
