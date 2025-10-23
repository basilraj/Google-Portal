import { PrismaClient } from '@prisma/client';

// By instantiating the client outside of the handler, we can reuse the same
// instance across multiple "warm" serverless function invocations.
// A new instance will only be created on a "cold start".
const prisma = new PrismaClient({
  // Suppress all logs to prevent `stdout` pollution which corrupts JSON responses
  // in serverless environments.
  log: [],
});

export default prisma;
