import express from "express"; 
import cors from "cors";  
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import userRoutes from "./routes/users.routes.js"
import companyRoutes from "./routes/companyRoutes.js";
import candidateProfileRoutes from "./routes/candidateProfiles.js";
import applicationStatusRoutes from "./routes/applicationStatusRoutes.js";
import candidateSkillRoutes from "./routes/candidateSkillRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import { setupSwagger } from './swagger/swagger.js';

const app = express();  

// 1. Konfigurimet bazë (Thirren vetëm NJË herë)
app.use(cors()); 
app.use(express.json()); 
app.use(loggerMiddleware);

// 2. Aktivizimi i Swagger UI
setupSwagger(app);

// 3. Rrugët e aplikacionit (Routes)
app.use("/users", userRoutes);  
app.use("/companies", companyRoutes);
app.use("/candidate-profiles", candidateProfileRoutes);
app.use("/application-statuses", applicationStatusRoutes);
app.use("/candidate-skills", candidateSkillRoutes);
app.use('/api/saved-jobs', savedJobRoutes);

// Testimi i rrënjës kryesore
app.get("/", (req, res) => {
  res.json({ message: "HireFlow API is working" });
});

export default app;