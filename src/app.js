import express from "express";
import cors from "cors";

import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import candidateProfileRoutes from "./routes/candidateProfiles.js";

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // extra safety

app.use(loggerMiddleware);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/companies", companyRoutes);
app.use("/candidate-profiles", candidateProfileRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HireFlow API is working"
  });
});

// ERROR HANDLER (LAST)
app.use(errorHandler);

export default app;
