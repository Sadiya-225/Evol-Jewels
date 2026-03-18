import { pgTable, text, timestamp, decimal } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  paymentMethod: text("payment_method").notNull(), // "card", "upi", "netbanking", "wallet", "cod"
  paymentGateway: text("payment_gateway"), // "razorpay", "stripe", etc.
  transactionId: text("transaction_id").unique(),
  status: text("status").notNull().default("pending"), // "pending", "processing", "completed", "failed", "refunded"
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  paymentDetails: text("payment_details"), // JSON string for additional payment info
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
