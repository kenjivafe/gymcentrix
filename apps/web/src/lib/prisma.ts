// Re-export the shared Prisma client from the @gymcentrix/db package.
// This keeps existing import paths (`@/lib/prisma`) working across the web app.
import { prisma } from "@gymcentrix/db";
export default prisma;
