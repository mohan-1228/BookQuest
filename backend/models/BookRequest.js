// models/BookRequest.js
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    trim: true,
  },
  isbn: {
    type: String,
    trim: true,
  },
  condition: {
    type: String,
    enum: ["new", "like_new", "good", "fair"],
    default: "good",
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
  deadline: {
    type: Date,
  },
  notes: {
    type: String,
    trim: true,
  },
});

const bookRequestSchema = new mongoose.Schema({
  books: [bookSchema], // Array of books
  status: {
    type: String,
    enum: ["open", "fulfilled", "cancelled"],
    default: "open",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("BookRequest", bookRequestSchema);
