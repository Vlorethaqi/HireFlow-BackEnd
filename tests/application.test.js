import request from "supertest";
import app from "../src/app.js";

describe("Applications API", () => {
  test("GET /applications/me should return 401 when token is missing", async () => {
    const response = await request(app).get("/applications/me");

    expect(response.statusCode).toBe(401);
  });

  test("POST /applications/apply should return 401 when token is missing", async () => {
    const response = await request(app)
      .post("/applications/apply")
      .send({
        jobId: 1,
        coverLetter: "Test cover letter",
      });

    expect(response.statusCode).toBe(401);
  });

  test("GET /applications/company should return 401 when token is missing", async () => {
    const response = await request(app).get("/applications/company");

    expect(response.statusCode).toBe(401);
  });
});