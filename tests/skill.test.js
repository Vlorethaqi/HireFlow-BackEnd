import request from "supertest";
import app from "../src/app.js";

describe("Skills API", () => {
  test("GET /skills should return 200", async () => {
    const response = await request(app).get("/skills");

    expect(response.statusCode).toBe(200);
  });

  test("POST /skills should return 401 when token is missing", async () => {
    const response = await request(app)
      .post("/skills")
      .send({
        name: "Test Skill",
      });

    expect(response.statusCode).toBe(401);
  });

  test("DELETE /skills/1 should return 401 when token is missing", async () => {
    const response = await request(app).delete("/skills/1");

    expect(response.statusCode).toBe(401);
  });
});