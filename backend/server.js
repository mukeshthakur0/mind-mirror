import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import journalRoutes from "./routes/journalroutes.js";

const app = express();

// ✅ CORS & JSON Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ✅ Routes
app.use("/api/journals", journalRoutes);

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/journalApp")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));