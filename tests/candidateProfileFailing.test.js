import request from "supertest";
import app from "../src/app.js";

describe("Candidate Profile API - failing test example", () => {
  test("POST /candidate-profiles should return 401 when token is missing", async () => {
    const response = await request(app)
      .post("/candidate-profiles")
      .send({
        fullName: "Test Candidate",
        phone: "044000000",
        address: "Prishtine",
        education: "Computer Science",
        experience: "Internship",
      });

    expect(response.statusCode).toBe(401);
  });
});