import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { categories } from "@/db/schema";

export const categoriesRouter = router({
  // Get all active categories
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(desc(categories.createdAt));
  }),

  // Get category by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    }),

  // Get category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, input.slug),
      });

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    }),
});
