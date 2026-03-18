import { router } from "./trpc";
import { productsRouter } from "./routers/products";
import { categoriesRouter } from "./routers/categories";
import { storesRouter } from "./routers/stores";
import { ordersRouter } from "./routers/orders";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  products: productsRouter,
  categories: categoriesRouter,
  stores: storesRouter,
  orders: ordersRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
