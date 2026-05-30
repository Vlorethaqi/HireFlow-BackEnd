import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  test("POST /auth/login should fail with invalid credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });

  test("POST /auth/login should fail when email is missing", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        password: "password123",
      });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });

  test("POST /auth/login should fail when password is missing", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@example.com",
      });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });
});