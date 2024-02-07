const request = require("supertest");

const app = require("./../../src/config/app");
const sequelize = require("./../../src/config/db");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe("POST /api/v1/auth/signup", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      first_name: "ahmed",
      last_name: "mabrouk",
      email: "ahmed@test.com",
      password: "123465789",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.user).toHaveProperty("access_token");
    expect(res.body.data.user).toHaveProperty("refresh_token");
  });

  it("should return 400 status code with User already exists message", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      first_name: "ahmed",
      last_name: "mabrouk",
      email: "ahmed@test.com",
      password: "123465789",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("User already exists");
  });

  it("should return 400 status code with Invalid email message", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      first_name: "ahmed",
      last_name: "mabrouk",
      email: "ahmed",
      password: "123465789",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("Invalid email");
  });

  it("should return 400 status code with Password must be at least 8 characters long message", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      first_name: "ahmed",
      last_name: "mabrouk",
      email: "ahmed@test.com",
      password: "12345",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(
      "Password must be at least 8 characters long"
    );
  });

  it("should return 400 status code with First name is required message", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      last_name: "mabrouk",
      email: "ahmed@test.com",
      password: "123465789",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("First name is required");
  });
});

describe("POST /api/v1/auth/login", () => {
  it("should login a user", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "ahmed@test.com",
      password: "123465789",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.user).toHaveProperty("access_token");
    expect(res.body.data.user).toHaveProperty("refresh_token");
  });

  it("should return 404 status code with Invalid email or password message", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "ahmed",
      password: "123465789",
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch("Invalid email or password");
  });

  it("should return 400 status code with Email and password are required message", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      password: "123465789",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("Email and password are required");
  });
});

afterAll(async () => {
  await sequelize.close();
});
