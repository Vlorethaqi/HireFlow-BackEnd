import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";

process.env.JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_key";

describe("Notifications API", () => {
  test("GET /notifications should return 401 when token is missing", async () => {
    const response = await request(app).get("/notifications");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("GET /notifications should not return 401 when token is provided", async () => {
    const token = jwt.sign(
      {
        id: 1,
        userId: 1,
        role: "ADMIN",
      },
      process.env.JWT_SECRET
    );

    const response = await request(app)
      .get("/notifications")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).not.toBe(401);
  });
});