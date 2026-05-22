import express from "express";
import cors from "cors";

import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import candidateProfileRoutes from "./routes/candidateProfiles.js";
import applicationStatusRoutes from "./routes/applicationStatusRoutes.js";
import candidateSkillRoutes from "./routes/candidateSkillRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import { setupSwagger } from "./swagger/swagger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

setupSwagger(app);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/companies", companyRoutes);
app.use("/candidate-profiles", candidateProfileRoutes);
app.use("/application-statuses", applicationStatusRoutes);
app.use("/candidate-skills", candidateSkillRoutes);
app.use("/api/saved-jobs", savedJobRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HireFlow API is working"
  });
});

app.use(errorHandler);

export default app;
