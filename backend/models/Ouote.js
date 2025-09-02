import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  vendorDetails: {
    contactPerson: { type: String, required: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    taxId: { type: String },
    paymentTerms: { type: String, default: "Net 30" },
  },

  // Individual book pricing details
  books: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Book", // Reference to the book in the request
      },
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
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      condition: {
        type: String,
        enum: ["new", "like_new", "good", "fair"],
        default: "new",
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],

  // Total price for the entire quote
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },

  notes: {
    type: String,
    trim: true,
  },

  estimatedDelivery: {
    type: Date,
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookRequest",
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

// Update the updatedAt field before saving
quoteSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to calculate total price
quoteSchema.statics.calculateTotal = function (books) {
  return books.reduce((total, book) => total + (book.totalPrice || 0), 0);
};

// Virtual for formatted total price
quoteSchema.virtual("formattedTotalPrice").get(function () {
  return `$${this.totalPrice.toFixed(2)}`;
});

// Instance method to check if quote can be modified
quoteSchema.methods.canModify = function () {
  return this.status === "pending";
};

// Index for better query performance
quoteSchema.index({ vendorId: 1, requestId: 1 });
quoteSchema.index({ requestId: 1, status: 1 });
quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ vendorId: 1, createdAt: -1 });

export default mongoose.model("Quote", quoteSchema);
