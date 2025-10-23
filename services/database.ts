import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// FIX: Replaced 'global' with 'globalThis' for cross-platform compatibility.
export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    // Disable all logging to stdout to prevent polluting serverless function responses.
    log: [],
  });

// FIX: Replaced 'global' with 'globalThis' for cross-platform compatibility.
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default prisma;