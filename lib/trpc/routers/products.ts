import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { eq, and, gte, lte, desc, asc, sql, inArray } from "drizzle-orm";
import { products, categories, productVariants, baseVariants, stoneSpecifications } from "@/db/schema";

export const productsRouter = router({
  // Get all products with filters
  list: publicProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        goldKarat: z.string().optional(),
        goldColor: z.string().optional(),
        isCustomizable: z.boolean().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sortBy: z.enum(["newest", "price_asc", "price_desc", "name"]).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const {
        categoryId,
        goldKarat,
        goldColor,
        isCustomizable,
        minPrice,
        maxPrice,
        sortBy = "newest",
        limit,
        offset,
      } = input;

      // Build where conditions
      const conditions = [];
      conditions.push(eq(products.isActive, true));

      if (categoryId) {
        conditions.push(eq(products.categoryId, categoryId));
      }

      if (minPrice !== undefined) {
        conditions.push(gte(products.basePrice, minPrice.toString()));
      }

      if (maxPrice !== undefined) {
        conditions.push(lte(products.basePrice, maxPrice.toString()));
      }

      // Build order by
      let orderBy;
      switch (sortBy) {
        case "price_asc":
          orderBy = asc(products.basePrice);
          break;
        case "price_desc":
          orderBy = desc(products.basePrice);
          break;
        case "name":
          orderBy = asc(products.name);
          break;
        case "newest":
        default:
          orderBy = desc(products.createdAt);
          break;
      }

      const result = await ctx.db
        .select({
          product: products,
          category: categories,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      return result;
    }),

  // Get product by ID with all variants
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.id),
        with: {
          category: true,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Get all variants for this product
      const variantsData = await ctx.db
        .select({
          variant: productVariants,
          baseVariant: baseVariants,
          stoneSpec: stoneSpecifications,
        })
        .from(productVariants)
        .leftJoin(baseVariants, eq(productVariants.baseVariantId, baseVariants.id))
        .leftJoin(stoneSpecifications, eq(productVariants.stoneSpecId, stoneSpecifications.id))
        .where(eq(productVariants.productId, input.id));

      // Flatten variants for easier frontend consumption
      const variants = variantsData.map((v) => ({
        id: v.variant.id,
        sku: v.variant.sku,
        price: parseFloat(v.variant.variantPrice),
        stockQuantity: v.variant.stockQuantity,
        goldKarat: v.baseVariant?.goldKarat || "",
        goldColor: v.baseVariant?.goldColor || "",
        goldWeight: v.baseVariant?.goldWeight || 0,
        isCustomizable: v.baseVariant?.isCustomizable || false,
        stoneType: v.stoneSpec?.stoneType,
        stoneQuality: v.stoneSpec?.stoneQuality,
        stoneColor: v.stoneSpec?.stoneColor,
        stoneWeight: v.stoneSpec?.stoneWeight ? parseFloat(v.stoneSpec.stoneWeight) : undefined,
        stoneCount: v.stoneSpec?.stoneCount,
      }));

      return {
        ...product,
        price: parseFloat(product.basePrice),
        variants,
      };
    }),

  // Get product by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.slug, input.slug),
      });

      if (!product) {
        throw new Error("Product not found");
      }

      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, product.categoryId),
      });

      // Get all variants for this product
      const variantsData = await ctx.db
        .select({
          variant: productVariants,
          baseVariant: baseVariants,
          stoneSpec: stoneSpecifications,
        })
        .from(productVariants)
        .leftJoin(baseVariants, eq(productVariants.baseVariantId, baseVariants.id))
        .leftJoin(stoneSpecifications, eq(productVariants.stoneSpecId, stoneSpecifications.id))
        .where(eq(productVariants.productId, product.id));

      // Flatten variants for easier frontend consumption
      const variants = variantsData.map((v) => ({
        id: v.variant.id,
        sku: v.variant.sku,
        price: parseFloat(v.variant.variantPrice),
        stockQuantity: v.variant.stockQuantity,
        goldKarat: v.baseVariant?.goldKarat || "",
        goldColor: v.baseVariant?.goldColor || "",
        goldWeight: v.baseVariant?.goldWeight || 0,
        isCustomizable: v.baseVariant?.isCustomizable || false,
        stoneType: v.stoneSpec?.stoneType,
        stoneQuality: v.stoneSpec?.stoneQuality,
        stoneColor: v.stoneSpec?.stoneColor,
        stoneWeight: v.stoneSpec?.stoneWeight ? parseFloat(v.stoneSpec.stoneWeight) : undefined,
        stoneCount: v.stoneSpec?.stoneCount,
      }));

      return {
        ...product,
        price: parseFloat(product.basePrice),
        category,
        variants,
      };
    }),

  // Get featured products
  featured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(6) }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          product: products,
          category: categories,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(and(eq(products.isFeatured, true), eq(products.isActive, true)))
        .orderBy(desc(products.createdAt))
        .limit(input.limit);

      return result;
    }),

  // Get related products
  related: publicProcedure
    .input(z.object({ productId: z.string(), limit: z.number().default(4) }))
    .query(async ({ ctx, input }) => {
      // First get the product to find its category
      const currentProduct = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.productId),
      });

      if (!currentProduct) {
        return { products: [] };
      }

      const result = await ctx.db
        .select({
          product: products,
          category: categories,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          and(
            eq(products.categoryId, currentProduct.categoryId),
            eq(products.isActive, true),
            sql`${products.id} != ${input.productId}`
          )
        )
        .orderBy(desc(products.createdAt))
        .limit(input.limit);

      return { products: result };
    }),

  // Full-text search using PostgreSQL tsvector/tsquery
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, limit } = input;

      // Sanitize and prepare the search query for PostgreSQL tsquery
      // Split by spaces and join with '&' for AND search, or '|' for OR
      const searchTerms = query
        .trim()
        .split(/\s+/)
        .filter((term) => term.length > 0)
        .map((term) => term.replace(/[^\w]/g, "")) // Remove special chars
        .filter((term) => term.length > 0)
        .join(" | "); // Use OR for more inclusive results

      if (!searchTerms) {
        return [];
      }

      // Use PostgreSQL full-text search with tsvector/tsquery
      // Search in name and description
      const result = await ctx.db
        .select({
          product: products,
          category: categories,
          rank: sql<number>`ts_rank(
            to_tsvector('english', coalesce(${products.name}, '') || ' ' || coalesce(${products.description}, '')),
            to_tsquery('english', ${searchTerms})
          )`.as("rank"),
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          and(
            eq(products.isActive, true),
            sql`to_tsvector('english', coalesce(${products.name}, '') || ' ' || coalesce(${products.description}, '')) @@ to_tsquery('english', ${searchTerms})`
          )
        )
        .orderBy(sql`rank DESC`)
        .limit(limit);

      return result.map((r) => ({
        product: r.product,
        category: r.category,
      }));
    }),
});
