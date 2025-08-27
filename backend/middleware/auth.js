import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Auth middleware
export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid.",
      });
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token is not valid.",
    });
  }
};

// Optional admin middleware
export const adminAuth = (req, res, next) => {
  try {
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin required." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default auth;
