import app from "./app.js";
import sequelize from "./config/db.js";

const PORT = process.env.PORT || 3000;

sequelize.authenticate()//me testu a asht tu u lidh me db 
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("DB error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});