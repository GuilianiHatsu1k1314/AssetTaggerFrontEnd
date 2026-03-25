import { Link, useNavigate } from "@tanstack/react-router";

// Make sure this path is correct based on where your Sidebar is located!
import { useDatabase } from "../context/-AssetContext";

import JDNLogo from "/jdnlogowhite.png";

export function Sidebar() {
  const navigate = useNavigate();
  // 1. Pull in currentUser from the context!
  const { currentUser, logoutUser } = useDatabase();

  // 2. Check if the user's role is Admin based on the live context data
  const isAdmin = currentUser?.roleName === "Admin";

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Call the API to destroy the httpOnly cookie and clear the Context state.
    // (Your AssetContext already handles grabbing the ID and clearing localStorage!)
    await logoutUser();

    // Safely redirect back to the Login page AFTER the API is done
    navigate({ to: "/" });
  };

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Hidden on Mobile) */}
      <div className="sticky top-0 hidden h-screen w-32 shrink-0 flex-col items-center overflow-hidden bg-[#0031AB] py-10 text-white shadow-2xl md:flex">
        <div className="mb-14">
          <img alt="Logo" className="h-10 w-auto" src={JDNLogo} />
        </div>

        <nav className="flex w-full flex-col gap-8 text-center">
          <Link
            className="text-xl font-medium transition-colors hover:text-blue-200"
            to="/LandingPage"
          >
            Dashboard
          </Link>
          <Link
            className="text-xl font-medium transition-colors hover:text-blue-200"
            to="/TableSelection"
          >
            Tables
          </Link>
          <Link
            className="text-xl font-medium transition-colors hover:text-blue-200"
            to="/ScanQR"
          >
            Scan QR
          </Link>

          {/* --- ADMIN LINK (Desktop) --- */}
          {isAdmin && (
            <Link
              className="text-xl font-medium transition-colors hover:text-blue-200"
              to="/adminpages/AdminPage"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="mt-auto">
          <button
            className="group flex items-center text-black transition-colors hover:text-white"
            onClick={handleLogout}
            title="Logout"
          >
            <svg
              fill="none"
              height="32"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="32"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. MOBILE BOTTOM NAVIGATION (Hidden on Desktop) */}
      <div className="fixed right-0 bottom-0 left-0 z-50 flex h-20 items-center justify-between border-t border-gray-300 bg-white px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
        <Link
          className="flex flex-col items-center gap-1 text-black hover:text-blue-600"
          to="/LandingPage"
        >
          <svg
            fill="none"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* Center Camera Icon (Elevated) */}
        <div className="relative -top-5">
          <Link
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#1d4ed8] bg-white text-black shadow-md hover:bg-gray-50"
            to="/ScanQR"
          >
            <svg
              fill="none"
              height="28"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="28"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </Link>
        </div>

        <Link
          className="flex flex-col items-center gap-1 text-black hover:text-blue-600"
          to="/TableSelection"
        >
          <svg
            fill="none"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <rect height="18" rx="2" ry="2" width="18" x="3" y="3"></rect>
            <line x1="3" x2="21" y1="9" y2="9"></line>
            <line x1="3" x2="21" y1="15" y2="15"></line>
          </svg>
          <span className="text-[10px] font-medium">Tables</span>
        </Link>

        {/* --- ADMIN LINK (Mobile) --- */}
        {isAdmin && (
          <Link
            className="flex flex-col items-center gap-1 text-black hover:text-blue-600"
            to="/adminpages/AdminPage"
          >
            <svg
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span className="text-[10px] font-medium">Admin</span>
          </Link>
        )}

        <button
          className="flex flex-col items-center gap-1 text-black hover:text-blue-600"
          onClick={handleLogout}
        >
          <svg
            fill="none"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </div>
    </>
  );
}
