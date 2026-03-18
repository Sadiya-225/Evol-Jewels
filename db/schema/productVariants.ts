import { pgTable, text, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { products } from "./products";
import { baseVariants } from "./baseVariants";
import { stoneSpecifications } from "./stoneSpecifications";

export const productVariants = pgTable("product_variants", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  baseVariantId: text("base_variant_id").notNull().references(() => baseVariants.id),
  stoneSpecId: text("stone_spec_id").references(() => stoneSpecifications.id),
  sku: text("sku").notNull().unique(),
  variantPrice: decimal("variant_price", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
