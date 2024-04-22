const request = require("supertest");

const app = require("./../../src/config/app");
const sequelize = require("./../../src/config/db");
const db = require("./../../src/models/index");
const redis = require("./../../src/config/redis");
const userServices = require("./../../src/services/userServices");
const masjidServices = require("./../../src/services/masjidServices");

let access_token;
let refresh_token;

const addAdmin = async () => {
  await userServices.createUser({
    first_name: "admin",
    last_name: "test",
    email: "admin@test.com",
    password: "123456789",
    user_type: "admin",
  });
};

const loginAdmin = async () => {
  const user = await userServices.login("admin@test.com", "123456789");
  access_token = user.dataValues.access_token;
  refresh_token = user.dataValues.refresh_token;
};

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await addAdmin();
});

describe("POST /masjids", () => {
  it("should return 401 status code with Unauthorized message", async () => {
    const res = await request(app)
      .post("/api/v1/masjids")
      .send({
        name: "test masjid",
        description: "test description",
        capacity: 100,
        state: "test state",
        city: "test city",
        longitude: 1,
        latitude: 1,
      })
      .expect(401);
    expect(res.body.status).toMatch("FAIL");
  });

  it("should create a new masjid", async () => {
    await loginAdmin();
    const res = await request(app)
      .post("/api/v1/masjids")
      .send({
        name: "test masjid",
        description: "test description",
        capacity: 100,
        state: "test state",
        city: "test city",
        longitude: 1,
        latitude: 1,
      })
      .set({
        access_token: `Bearer ${access_token}`,
        refresh_token: `Bearer ${refresh_token}`,
      })
      .expect(201);

    expect(res.body.status).toMatch("Success");
    expect(res.body.data.masjid_id).toBeDefined();
  });

  it("should return 400 status code with Invalid capacity message", async () => {
    const res = await request(app)
      .post("/api/v1/masjids")
      .send({
        name: "test masjid",
        description: "test description",
        capacity: -100,
        state: "test state",
        city: "test city",
        longitude: 1,
        latitude: 1,
      })
      .set({
        access_token: `Bearer ${access_token}`,
        refresh_token: `Bearer ${refresh_token}`,
      })
      .expect(400);
    expect(res.body.status).toMatch("FAIL");
    expect(res.body.message).toMatch("capacity must be a positive number");
  });

  it("should return 400 status code with name is required message", async () => {
    const res = await request(app)
      .post("/api/v1/masjids")
      .send({
        description: "test description",
        capacity: 100,
        state: "test state",
        city: "test city",
        longitude: 1,
        latitude: 1,
      })
      .set({
        access_token: `Bearer ${access_token}`,
        refresh_token: `Bearer ${refresh_token}`,
      })
      .expect(400);
    expect(res.body.status).toMatch("FAIL");
    expect(res.body.message).toMatch("name is required");
  });
});

describe("DELETE /masjids/:masjid_id", () => {
  it("should delete a masjid", async () => {
    const res = await request(app)
      .delete(`/api/v1/masjids/1`)
      .set({
        access_token: `Bearer ${access_token}`,
        refresh_token: `Bearer ${refresh_token}`,
      })
      .expect(200);
    expect(res.body.status).toMatch("Success");
    expect(res.body.message.toLowerCase()).toMatch(
      "masjid deleted successfully"
    );
  });

  it("should return 404 status code with Masjid not found message", async () => {
    const res = await request(app)
      .delete("/api/v1/masjids/1000")
      .set({
        access_token: `Bearer ${access_token}`,
        refresh_token: `Bearer ${refresh_token}`,
      })
      .expect(404);
    expect(res.body.status).toMatch("FAIL");
    expect(res.body.message.toLowerCase()).toMatch("masjid not found");
  });
});

describe("GET /masjids", () => {
  it("should return 200 status code with empty result", async () => {
    const res = await request(app).get("/api/v1/masjids").expect(200);
    expect(res.body.status).toMatch("Success");
    expect(res.body.data.masjids).toHaveLength(0);
  });

  it("should return all masjids", async () => {
    await masjidServices.addMasjid({
      name: `masjid 1`,
      description: "test description",
      capacity: 100,
      state: "test state",
      city: "test city",
      longitude: 1,
      latitude: 1,
    });

    const res = await request(app).get("/api/v1/masjids").expect(200);
    expect(res.body.status).toMatch("Success");
    expect(res.body.data.masjids).toHaveLength(1);
  });
});

afterAll(async () => {
  await db.User.destroy({ where: {} });
  await sequelize.close();
  await redis.disconnect();
});
