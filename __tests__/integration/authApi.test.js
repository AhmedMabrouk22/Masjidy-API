const request = require("supertest");

const app = require("./../../src/config/app");
const sequelize = require("./../../src/config/db");
const authUtils = require("./../../src/utils/authUtils");
const db = require("./../../src/models/index");
const redis = require("./../../src/config/redis");

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

  it("should return 404 status code with Invalid email message", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "ahmed",
      password: "123465789",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("Invalid email");
  });

  it("should return 400 status code with Email is required message", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      password: "123465789",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("Email is required");
  });
});

describe("POST /api/v1/auth/forgetPassword", () => {
  it("should send a password reset code to the user's email", async () => {
    authUtils.sendMail = jest.fn();
    const res = await request(app).post("/api/v1/auth/forgetPassword").send({
      email: "ahmed@test.com",
    });

    expect(authUtils.sendMail).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch("Password reset code sent to your email");
  });

  it("should return 404 status code with User not found message", async () => {
    const res = await request(app).post("/api/v1/auth/forgetPassword").send({
      email: "ahmed1@test.com",
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch("User not found");
  });
});

describe("POST /api/v1/auth/verifyResetCode", () => {
  it("should verify the reset code for a user's password reset", async () => {
    const user = await db.User.findOne({
      where: {
        email: "ahmed@test.com",
      },
    });

    const resetCode = authUtils.hashResetCode("123456");
    const userAuth = await db.User_Auth.create({
      user_id: user.dataValues.id,
      reset_password_code: resetCode,
      reset_code_expires_at: new Date(
        Date.now() + 30 * 60 * 1000
      ).toUTCString(),
      is_verified: false,
    });

    const res = await request(app).post("/api/v1/auth/verifyResetCode").send({
      email: "ahmed@test.com",
      code: "123456",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch("Password reset code verified");
  });

  it("should return 400 status code with Invalid or expired reset code message", async () => {
    const user = await db.User.findOne({
      where: {
        email: "ahmed@test.com",
      },
    });

    const resetCode = authUtils.hashResetCode("123456");
    const userAuth = await db.User_Auth.create({
      user_id: user.dataValues.id,
      reset_password_code: resetCode,
      reset_code_expires_at: new Date(
        Date.now() + -1 * 60 * 1000
      ).toUTCString(),
      is_verified: false,
    });

    const res = await request(app).post("/api/v1/auth/verifyResetCode").send({
      email: "ahmed@test.com",
      code: "123456",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("Invalid or expired reset code");
  });

  it("should return 400 status code with Invalid or expired reset code message", async () => {
    const res = await request(app).post("/api/v1/auth/verifyResetCode").send({
      email: "ahmed@test.com",
      code: "123456",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch("Invalid or expired reset code");
  });
});

describe("POST /api/v1/auth/resetPassword", () => {
  it("should reset password for the user", async () => {
    const res = await request(app).post("/api/v1/auth/resetPassword").send({
      email: "ahmed@test.com",
      password: "123456789",
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch("Password reset successful");
  });
});

afterAll(async () => {
  await sequelize.close();
  await redis.disconnect();
});
