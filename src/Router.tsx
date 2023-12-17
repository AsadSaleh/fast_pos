import { RootRoute, Route, Router } from "@tanstack/react-router";
import Home from "./pages/Home";
import Payment from "./pages/Payment";

import { z } from "zod";
import Root from "./pages/Root";
import OrderRecap from "./pages/OrderRecap";

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  category: z.enum(["drink", "food"]).nullable(),
  image_url: z.string().nullable(),
  description: z.string().nullable(),
});
export type Product = z.infer<typeof productSchema>;

const orderItemSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  product: productSchema,
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderItemArraySchema = z.array(orderItemSchema);

const orderRecapSearchSchema = z.object({
  // customerName: z.string(),
  orderItems: z.array(
    z.object({ id: z.number(), product: productSchema, quantity: z.number() })
  ),
});
export type OrderRecapSearch = z.infer<typeof orderRecapSearchSchema>;

const paymentSearchSchema = z.object({
  orderId: z.number(),
});

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});

// function Root() {
//   return <Outlet />;
// }

// Create an index route
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

// const aboutRoute = new Route({
//   getParentRoute: () => rootRoute,
//   path: "/about",
//   component: Payment,
// });

export const orderRecapRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/order-recap",
  component: OrderRecap,
  validateSearch: orderRecapSearchSchema,
});

export const paymentRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/payment",
  component: Payment,
  validateSearch: paymentSearchSchema,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  orderRecapRoute,
  paymentRoute,
]);

// Create the router using your route tree
const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
