import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import sequelize from "./config/db.js";
import "./models/index.js";
import { ApplicationStatus } from "./models/index.js";

const PORT = process.env.PORT || 3000;

async function seedApplicationStatuses() {
    const statuses = [
        ["PENDING", "Application was submitted and is waiting for review"],
        ["REVIEWED", "Application was reviewed by HR"],
        ["INTERVIEW", "Candidate was invited to interview"],
        ["ACCEPTED", "Candidate was accepted"],
        ["REJECTED", "Candidate was rejected"],
    ];

    for (const [name, description] of statuses) {
        await ApplicationStatus.findOrCreate({
            where: { name },
            defaults: { description },
        });
    }
}

sequelize.sync()
    .then(async () => {
        await seedApplicationStatuses();
        console.log("Database synced successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Swagger Docs running on http://localhost:${PORT}/api-docs/`);
        });
    })
    .catch((error) => {
        console.error("DB error:", error);
    });
