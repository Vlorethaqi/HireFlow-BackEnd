import request from "supertest";
import app from "../src/app.js";

describe("Jobs API", () => {
  test("GET /jobs should return 200", async () => {
    const response = await request(app).get("/jobs");

    expect(response.statusCode).toBe(200);
  });

  test("GET /jobs should return data as an array or object", async () => {
    const response = await request(app).get("/jobs");

    expect(response.body).toBeDefined();
  });

  test("POST /jobs should return 401 when token is missing", async () => {
    const response = await request(app)
      .post("/jobs")
      .send({
        title: "Test Job",
        description: "Test description",
        location: "Prishtine",
        employmentType: "INTERNSHIP",
      });

    expect(response.statusCode).toBe(401);
  });
});