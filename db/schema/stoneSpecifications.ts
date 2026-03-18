import { pgTable, text, timestamp, integer, decimal } from "drizzle-orm/pg-core";

export const stoneSpecifications = pgTable("stone_specifications", {
  id: text("id").primaryKey(),
  stoneType: text("stone_type").notNull(), // "Diamond", "Ruby", "Emerald", etc.
  stoneQuality: text("stone_quality"), // "VS1", "VVS", "SI", etc.
  stoneColor: text("stone_color"), // "D", "E", "F", etc. for diamonds
  stoneWeight: decimal("stone_weight", { precision: 8, scale: 2 }), // in carats
  stoneCount: integer("stone_count"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type StoneSpecification = typeof stoneSpecifications.$inferSelect;
export type NewStoneSpecification = typeof stoneSpecifications.$inferInsert;
