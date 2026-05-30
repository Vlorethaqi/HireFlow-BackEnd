import request from "supertest";
import app from "../src/app.js";

describe("Departments API", () => {
  test("GET /departments should return 401 when token is missing", async () => {
    const response = await request(app).get("/departments");

    expect(response.statusCode).toBe(401);
  });

  test("POST /departments should return 401 when token is missing", async () => {
    const response = await request(app)
      .post("/departments")
      .send({
        name: "Test Department",
        description: "Test department description",
        companyId: 1,
      });

    expect(response.statusCode).toBe(401);
  });

  test("DELETE /departments/1 should return 404 if route is not found", async () => {
    const response = await request(app).delete("/departments/1");

    expect(response.statusCode).toBe(404);
  });
});