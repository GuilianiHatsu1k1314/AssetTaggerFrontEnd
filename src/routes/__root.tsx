import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { DatabaseProvider } from "./context/-AssetContext";

const RootLayout = () => (
  <DatabaseProvider>
    <Outlet />
    <TanStackRouterDevtools />
  </DatabaseProvider>
);

export const Route = createRootRoute({ component: RootLayout });
