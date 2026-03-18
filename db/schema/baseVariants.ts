import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const baseVariants = pgTable("base_variants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  goldKarat: text("gold_karat").notNull(), // "18K", "22K", "24K"
  goldColor: text("gold_color").notNull(), // "Yellow", "Rose", "White"
  goldWeight: integer("gold_weight").notNull(), // in grams
  isCustomizable: boolean("is_customizable").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BaseVariant = typeof baseVariants.$inferSelect;
export type NewBaseVariant = typeof baseVariants.$inferInsert;
