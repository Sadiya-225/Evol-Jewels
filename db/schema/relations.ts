import { relations } from "drizzle-orm";
import { user } from "./users";
import { session, account } from "./auth";
import { categories } from "./categories";
import { baseVariants } from "./baseVariants";
import { stoneSpecifications } from "./stoneSpecifications";
import { products } from "./products";
import { productVariants } from "./productVariants";
import { stores } from "./stores";
import { items } from "./items";
import { orders } from "./orders";
import { orderItems } from "./orderItems";
import { payments } from "./payments";

// Products relations
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
}));

// Categories relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// Product Variants relations
export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  baseVariant: one(baseVariants, {
    fields: [productVariants.baseVariantId],
    references: [baseVariants.id],
  }),
  stoneSpec: one(stoneSpecifications, {
    fields: [productVariants.stoneSpecId],
    references: [stoneSpecifications.id],
  }),
  items: many(items),
  orderItems: many(orderItems),
}));

// Base Variants relations
export const baseVariantsRelations = relations(baseVariants, ({ many }) => ({
  productVariants: many(productVariants),
}));

// Stone Specifications relations
export const stoneSpecificationsRelations = relations(stoneSpecifications, ({ many }) => ({
  productVariants: many(productVariants),
}));

// Orders relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  orderItems: many(orderItems),
  payments: many(payments),
}));

// User relations (BetterAuth)
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  orders: many(orders),
}));

// Session relations (BetterAuth)
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

// Account relations (BetterAuth)
export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Stores relations
export const storesRelations = relations(stores, ({ many }) => ({
  items: many(items),
  orders: many(orders),
}));

// Items relations
export const itemsRelations = relations(items, ({ one }) => ({
  store: one(stores, {
    fields: [items.storeId],
    references: [stores.id],
  }),
  productVariant: one(productVariants, {
    fields: [items.productVariantId],
    references: [productVariants.id],
  }),
}));

// Order Items relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
}));

// Payments relations
export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));
