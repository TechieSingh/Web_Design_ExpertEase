import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import initializeRoutes from "./routes/index.js";

const initialize = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ required: true }));
  console.log("MongoDB Connection URI:", process.env.MONGO_CONNECTION);
  mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
  initializeRoutes(app);
};

export default initialize;
