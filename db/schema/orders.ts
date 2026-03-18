import { pgTable, text, timestamp, decimal } from "drizzle-orm/pg-core";
import { user } from "./users";
import { stores } from "./stores";

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  storeId: text("store_id").references(() => stores.id), // Optional: for in-store pickup
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
