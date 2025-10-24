// FIX: The error "Module '@prisma/client' has no exported member 'PrismaClient'" can occur due to ES Module/CommonJS interoperability issues.
// We use `require` for the PrismaClient constructor and derive the instance type from it instead of using a direct type import.
import { createRequire } from 'module';
import process from 'process';

const require = createRequire(import.meta.url);
const { PrismaClient: PrismaClientCjs } = require('@prisma/client');

type PrismaClient = InstanceType<typeof PrismaClientCjs>;

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use the CJS constructor for the instance, but type it with the derived type
const prisma: PrismaClient = globalThis.prisma || new PrismaClientCjs();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
