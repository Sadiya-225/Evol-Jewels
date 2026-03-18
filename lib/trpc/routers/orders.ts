import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { orders, orderItems, productVariants, products } from "@/db/schema";
import { nanoid } from "nanoid";

export const ordersRouter = router({
  // Get user's orders
  list: protectedProcedure.query(async ({ ctx }) => {
    const userOrders = await ctx.db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(desc(orders.createdAt));

    return userOrders;
  }),

  // Get order by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.query.orders.findFirst({
        where: eq(orders.id, input.id),
      });

      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found");
      }

      // Get order items
      const items = await ctx.db
        .select({
          orderItem: orderItems,
          variant: productVariants,
          product: products,
        })
        .from(orderItems)
        .leftJoin(productVariants, eq(orderItems.productVariantId, productVariants.id))
        .leftJoin(products, eq(productVariants.productId, products.id))
        .where(eq(orderItems.orderId, input.id));

      return {
        ...order,
        items,
      };
    }),

  // Create new order
  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productVariantId: z.string(),
            quantity: z.number().min(1),
            unitPrice: z.number(),
            customizationDetails: z.string().optional(),
          })
        ),
        storeId: z.string().optional(),
        shippingAddress: z.string(),
        billingAddress: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const orderId = nanoid();
      const orderNumber = `Evol-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // Calculate totals
      const subtotal = input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const tax = subtotal * 0.03; // 3% GST
      const shippingCost = 0; // Free shipping for now
      const total = subtotal + tax + shippingCost;

      // Create order
      await ctx.db.insert(orders).values({
        id: orderId,
        userId: ctx.user.id,
        storeId: input.storeId,
        orderNumber,
        status: "pending",
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shippingCost: shippingCost.toString(),
        total: total.toString(),
        shippingAddress: input.shippingAddress,
        billingAddress: input.billingAddress,
        notes: input.notes,
      });

      // Create order items
      for (const item of input.items) {
        await ctx.db.insert(orderItems).values({
          id: nanoid(),
          orderId,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          subtotal: (item.unitPrice * item.quantity).toString(),
          customizationDetails: item.customizationDetails,
        });
      }

      return { orderId, orderNumber };
    }),

  // Update order status
  updateStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify order belongs to user
      const order = await ctx.db.query.orders.findFirst({
        where: eq(orders.id, input.orderId),
      });

      if (!order || order.userId !== ctx.user.id) {
        throw new Error("Order not found");
      }

      await ctx.db
        .update(orders)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(orders.id, input.orderId));

      return { success: true };
    }),
});
