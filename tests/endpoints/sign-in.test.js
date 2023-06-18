import { PrismaClient, Prisma } from "@prisma/client";
import request from "supertest";
import app from "../../app.js";

async function cleanupDatabase() {
  const prisma = new PrismaClient();
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany())
  );
}

describe("POST /auth", () => {
  const user = {
    username: "johndoe",
    email: "john98@example.com",
    password: "123123123",
  };

  beforeAll(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
  }); // let user.test.js create user first then only clean up database

  it("upon sign up sucess, return token", async () => {
    await request(app)
      .post("/users")
      .send(user)
      .set("Accept", "application/json");

    const dummy = {
      email: "john98@example.com",
      password: "123123123",
    };
    const response = await request(app)
      .post("/auth")
      .send(dummy)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeTruthy();
  });

  it("with a wrong email, return 401 and not accessToken", async () => {
    await request(app)
      .post("/users")
      .send(user)
      .set("Accept", "application/json");

    user.email = "wrong@example.com";

    const response = await request(app)
      .post("/auth")
      .send(user)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error).toBe("Email address or password not valid");
  });

  it("with a wrong password", async () => {
    await request(app)
      .post("/users")
      .send(user)
      .set("Accept", "application/json");

    user.password = "wrong";

    const response = await request(app)
      .post("/auth")
      .send(user)
      .set("Accept", "application/json");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error).toBe("Email address or password not valid");
  });
});
