import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/table")({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
