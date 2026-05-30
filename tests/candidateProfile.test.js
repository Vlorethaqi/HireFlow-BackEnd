import request from "supertest";
import app from "../src/app.js";

describe("Candidate Profile API", () => {
  test("GET /candidate-profiles/me should return 401 when token is missing", async () => {
    const response = await request(app).get("/candidate-profiles/me");

    expect(response.statusCode).toBe(401);
  });

 test("POST /candidate-profiles should return error when token is missing", async () => {
  const response = await request(app)
    .post("/candidate-profiles")
    .send({
      fullName: "Test Candidate",
      phone: "044000000",
      address: "Prishtine",
      education: "Computer Science",
      experience: "Internship",
    });

  expect(response.statusCode).toBeGreaterThanOrEqual(400);
});

  test("PUT /candidate-profiles/me should return 401 when token is missing", async () => {
    const response = await request(app)
      .put("/candidate-profiles/me")
      .send({
        fullName: "Updated Candidate",
      });

    expect(response.statusCode).toBe(401);
  });
});