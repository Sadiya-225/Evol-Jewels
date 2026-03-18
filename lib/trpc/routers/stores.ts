import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { stores } from "@/db/schema";

export const storesRouter = router({
  // Get all active stores
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(stores)
      .where(eq(stores.isActive, true))
      .orderBy(desc(stores.createdAt));
  }),

  // Get store by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.db.query.stores.findFirst({
        where: eq(stores.id, input.id),
      });

      if (!store) {
        throw new Error("Store not found");
      }

      return store;
    }),

  // Get store by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const store = await ctx.db.query.stores.findFirst({
        where: eq(stores.slug, input.slug),
      });

      if (!store) {
        throw new Error("Store not found");
      }

      return store;
    }),
});
