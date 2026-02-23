import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { AssetProvider } from "./context/-AssetContext";

const RootLayout = () => (
  <AssetProvider>
    <Outlet />
    <TanStackRouterDevtools />
  </AssetProvider>
);

export const Route = createRootRoute({ component: RootLayout });
