import { createTRPCRouter } from "@/server/api/trpc";
import { superAdminRouter } from "./routers/super-admin";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  superAdmin: superAdminRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
