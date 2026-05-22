import app from "./app.js";
import sequelize from "./config/db.js";
import "./models/index.js";



const PORT = process.env.PORT || 3000;

sequelize.sync({ force: true })
    .then(() => {
        console.log("Database synced successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Swagger Docs running on http://localhost:${PORT}/api-docs/`);
        });
    })
    .catch((error) => {
        console.error("DB error:", error);
    });