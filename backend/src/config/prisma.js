const { PrismaClient } = require('@prisma/client');

// This singleton pattern prevents creating multiple Prisma Client instances.
// It checks if an instance already exists in the global scope, and if not, creates one.
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;

