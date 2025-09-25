/*
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe("Auth Prisma Tests", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should create a user", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "hashedpassword",
        role: "CUSTOMER",
      },
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("test@example.com");
  });
});
*/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe("Auth Prisma Tests", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany(); // reset users before each test
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should create a user", async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`, // unique email
        password: "hashedpassword",
        role: "CUSTOMER",
      },
    });

    expect(user.id).toBeDefined();
    expect(user.email).toContain("test-");
  });
});
