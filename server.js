const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./route/UserRoute");
const courseRoutes = require("./route/CourseRoute");
const branchRoutes = require("./route/BranchRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------------
// CORS FIX (IMPORTANT FOR VERcEL + RENDER)
// --------------------------
app.use(
  cors({
    origin: [
      "https://institute-frontend-t1z5.vercel.app", // your Vercel frontend
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Required to parse JSON
app.use(express.json());

// --------------------------
// STATIC UPLOADS FIX (VERY IMPORTANT)
// Allows images to load from `/uploads/...`
// --------------------------
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow images everywhere
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------------
// MONGODB CONNECTION
// --------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --------------------------
// ROUTES
// --------------------------
app.use("/api/users", userRoutes);
app.use("/api/login", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", branchRoutes);

// --------------------------
// START SERVER
// --------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
