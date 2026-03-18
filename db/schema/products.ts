import { pgTable, text, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  categoryId: text("category_id").notNull().references(() => categories.id),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  images: text("images").array().notNull(), // Array of image URLs
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  makingCharges: decimal("making_charges", { precision: 10, scale: 2 }).default("0").notNull(),
  gst: decimal("gst", { precision: 5, scale: 2 }).default("3").notNull(), // GST percentage
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
