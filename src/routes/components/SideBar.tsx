import { Link } from "@tanstack/react-router";

export function Sidebar() {
  return (
    // CHANGE 1: Added 'items-center' to the main container
    // This horizontally centers the Logo, Nav, and Logout button
    <div className="flex h-screen w-32 flex-col items-center bg-[#1d4ed8] py-10 text-white shadow-2xl">
      {/* Logo Section */}
      <div className="mb-14">
        <h1 className="text-4xl font-black tracking-tighter text-white">JDN</h1>
      </div>

      {/* Navigation Links */}
      {/* CHANGE 2: Added 'w-full' and 'text-center' */}
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
          to="/scan-qr"
        >
          Scan QR
        </Link>
      </nav>

      {/* Logout Icon (Bottom) */}
      <div className="mt-auto">
        <button
          className="group flex items-center text-black transition-colors hover:text-white"
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
  );
}
