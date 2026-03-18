import { z } from "zod";
import { router, adminProcedure } from "../trpc";
import {
  orders,
  orderItems,
  payments,
  items,
  products,
  productVariants,
  stores,
  baseVariants,
  stoneSpecifications,
  categories,
} from "@/db/schema";
import { eq, gte, and, sql, desc, asc, lt } from "drizzle-orm";

export const adminRouter = router({
  // Get dashboard stats
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Orders today
    const ordersToday = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, today),
          lt(orders.createdAt, tomorrow)
        )
      );

    // Total revenue (from completed payments)
    const revenue = await db
      .select({ total: sql<string>`COALESCE(SUM(amount), 0)` })
      .from(payments)
      .where(eq(payments.status, "completed"));

    // Low stock items (quantity < 5)
    const lowStockItems = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(lt(items.quantity, 5));

    // Total products
    const totalProducts = await db
      .select({ count: sql<number>`count(*)` })
      .from(products);

    // Total orders
    const totalOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);

    // Pending orders
    const pendingOrders = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.status, "pending"));

    return {
      ordersToday: Number(ordersToday[0]?.count || 0),
      revenue: parseFloat(revenue[0]?.total || "0"),
      lowStockItems: Number(lowStockItems[0]?.count || 0),
      totalProducts: Number(totalProducts[0]?.count || 0),
      totalOrders: Number(totalOrders[0]?.count || 0),
      pendingOrders: Number(pendingOrders[0]?.count || 0),
    };
  }),

  // Get all products with variants
  getProducts: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      let query = db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          basePrice: products.basePrice,
          isActive: products.isActive,
          isFeatured: products.isFeatured,
          stockQuantity: products.stockQuantity,
          categoryId: products.categoryId,
          categoryName: categories.name,
          createdAt: products.createdAt,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .orderBy(desc(products.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const result = await query;

      // Get total count
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(products);

      return {
        products: result,
        total: Number(countResult[0]?.count || 0),
      };
    }),

  // Update product
  updateProduct: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        basePrice: z.string().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      await ctx.db
        .update(products)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(products.id, id));

      return { success: true };
    }),

  // Delete product
  deleteProduct: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),

  // Get all orders
  getOrders: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        status: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const conditions = input.status
        ? [eq(orders.status, input.status)]
        : [];

      const result = await db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          status: orders.status,
          total: orders.total,
          createdAt: orders.createdAt,
          userId: orders.userId,
          storeId: orders.storeId,
          storeName: stores.name,
        })
        .from(orders)
        .leftJoin(stores, eq(orders.storeId, stores.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(orders.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      // Get total count
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return {
        orders: result,
        total: Number(countResult[0]?.count || 0),
      };
    }),

  // Update order status
  updateOrderStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(orders)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(orders.id, input.id));

      return { success: true };
    }),

  // Get inventory items
  getInventory: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        storeId: z.string().optional(),
        lowStock: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const conditions = [];
      if (input.storeId) {
        conditions.push(eq(items.storeId, input.storeId));
      }
      if (input.lowStock) {
        conditions.push(lt(items.quantity, 5));
      }

      const result = await db
        .select({
          id: items.id,
          quantity: items.quantity,
          reservedQuantity: items.reservedQuantity,
          storeId: items.storeId,
          storeName: stores.name,
          productVariantId: items.productVariantId,
          variantSku: productVariants.sku,
          variantPrice: productVariants.variantPrice,
          productId: products.id,
          productName: products.name,
          baseVariantName: baseVariants.name,
        })
        .from(items)
        .leftJoin(stores, eq(items.storeId, stores.id))
        .leftJoin(productVariants, eq(items.productVariantId, productVariants.id))
        .leftJoin(products, eq(productVariants.productId, products.id))
        .leftJoin(baseVariants, eq(productVariants.baseVariantId, baseVariants.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(items.quantity))
        .limit(input.limit)
        .offset(input.offset);

      // Get total count
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(items)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return {
        items: result,
        total: Number(countResult[0]?.count || 0),
      };
    }),

  // Update inventory quantity
  updateInventory: adminProcedure
    .input(
      z.object({
        id: z.string(),
        quantity: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(items)
        .set({ quantity: input.quantity, updatedAt: new Date() })
        .where(eq(items.id, input.id));

      return { success: true };
    }),

  // Get all stores (for filtering)
  getStores: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: stores.id,
        name: stores.name,
        city: stores.city,
      })
      .from(stores)
      .orderBy(asc(stores.name));
  }),
});
