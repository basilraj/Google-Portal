import { createRequire } from 'module';
import process from 'process';

const require = createRequire(import.meta.url);
// This ensures we correctly require the PrismaClient constructor from the CJS module.
const { PrismaClient } = require('@prisma/client');

type PrismaClientInstance = InstanceType<typeof PrismaClient>;

declare global {
  // Allow global `var` declarations for the singleton pattern.
  // eslint-disable-next-line no-var
  var prisma: PrismaClientInstance | undefined;
}

// Implements the singleton pattern to prevent multiple PrismaClient instances
// during development with hot-reloading.
const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
