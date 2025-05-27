import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config.js";

import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);

mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(config.port, () =>
      console.log(`🚀 Server running on port ${config.port}`)
    );
  })
  .catch((err) => console.error("MongoDB Error:", err));
