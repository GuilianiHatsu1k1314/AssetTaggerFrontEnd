import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useDatabase } from "../context/-AssetContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    // If the browser tries to render this page but the user is gone, kick them out!
    if (!currentUser) {
      navigate({ replace: true, to: "/" });
    }
  }, [currentUser, navigate]);

  // While checking, or if they are being redirected, show nothing.
  if (!currentUser) {
    return null;
  }

  // If they are safely logged in, render the page!
  return <>{children}</>;
}
