import app from "../src/app";
import supertest from "supertest";
import { describe, it, expect } from "vitest";

describe("Health API", () => {
  it("should return 200", async () => {
    const res = await supertest(app).get("/api/v1/health/check");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Healthy",
        status: 200,
      }),
    );
  });
});
