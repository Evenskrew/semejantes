const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../app");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe("POST /api/auth/sign-up-coordinator", () => {
  it("should create a new coordinator and return JWT", async () => {
    const newCoordinator = {
      username: "coord1",
      email: "test@example.com",
      password: "password123",
      phone: "1234567",
      position: "cocinero",
    };

    const response = await request(app)
      .post("/api/auth/sign-up-coordinator")
      .send(newCoordinator);

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data).toHaveProperty("token");

    const user = response.body.data.user;
    const token = response.body.data.token;

    expect(user).toHaveProperty("username", newCoordinator.username);
    expect(user).toHaveProperty("email", newCoordinator.email);
    expect(user).toHaveProperty("position", newCoordinator.position);
    expect(user).toHaveProperty("role", "Coordinator");
    expect(user).toHaveProperty("_id");
    expect(user).toHaveProperty("createdAt");
    expect(user).toHaveProperty("updatedAt");

    expect(token).toMatch(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/);
  });
});
