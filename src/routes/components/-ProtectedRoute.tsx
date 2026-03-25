import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useDatabase } from "../context/-AssetContext";

export function ProtectedRoute({
  children,
  requireAdmin = false, // Defaults to false, so standard pages don't break!
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { currentUser } = useDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. If the browser tries to render this page but the user is gone, kick them out!
    if (!currentUser) {
      navigate({ replace: true, to: "/" });
      return;
    }

    // 2. If the page requires Admin, but their role is something else, block them
    if (requireAdmin && currentUser.roleName !== "admin") {
      alert("Access Denied: You need Admin permissions to view this page.");
      navigate({ replace: true, to: "/LandingPage" }); // Send to a safe default page
    }
  }, [currentUser, navigate, requireAdmin]);

  // While checking, or if they are being redirected due to missing auth/permissions, show nothing.
  if (!currentUser || (requireAdmin && currentUser.roleName !== "Admin")) {
    return null;
  }

  // If they are safely logged in and have the right permissions, render the page!
  return <>{children}</>;
}
