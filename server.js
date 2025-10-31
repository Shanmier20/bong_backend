const express = require("express");
const cors = require("cors");
require("dotenv").config();
const productRoutes = require("./routes/product.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS configuration (includes OPTIONS for preflight)
app.use(cors({
  origin: [
    "http://localhost:5173",          // local dev frontend
    "https://bong-frontend.vercel.app", // your deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ include OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Simple Products REST API." });
});

// ✅ API routes
app.use("/api/products", productRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    detail: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Access the API at http://localhost:${PORT}`);
});


