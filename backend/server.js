import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import requestRoutes from "./routes/request.js";
import quoteRoutes from "./routes/quotes.js";
import isbnRoutes from "./routes/isbn.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/isbn", isbnRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// MongoDB connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// // TEMPORARY routes to prevent 404 errors
// app.get("/api/books", (req, res) => {
//   res.json({ success: true, data: [] });
// });

// app.get("/api/requests/my-requests", (req, res) => {
//   res.json({ success: true, data: [] });
// });

// app.get("/api/requests", (req, res) => {
//   res.json({ success: true, data: [] });
// });

// app.get("/api/quotes/my-quotes", (req, res) => {
//   res.json({ success: true, data: [] });
// });
