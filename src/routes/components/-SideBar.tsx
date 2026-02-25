import { Link } from "@tanstack/react-router";

export function Sidebar() {
  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Hidden on Mobile) */}
      {/* ADDED: 'sticky top-0', 'shrink-0', and 'overflow-hidden' */}
      <div className="sticky top-0 hidden h-screen w-32 shrink-0 flex-col items-center overflow-hidden bg-[#1d4ed8] py-10 text-white shadow-2xl md:flex">
        <div className="mb-14">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            JDN
          </h1>
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
        </nav>

        <div className="mt-auto">
          <Link to="/">
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
          </Link>
        </div>
      </div>

      {/* 2. MOBILE BOTTOM NAVIGATION (Hidden on Desktop) */}
      <div className="fixed right-0 bottom-0 left-0 z-50 flex h-20 items-center justify-between border-t border-gray-300 bg-white px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
        <Link
          className="flex flex-col items-center gap-1 text-black hover:text-blue-600"
          to="/"
        >
          <svg
            fill="none"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-[10px] font-medium">Home</span>
        </Link>

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
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
          <span className="text-[10px] font-medium">Dashboard</span>
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

        <Link to="/">
          <button className="flex flex-col items-center gap-1 text-black hover:text-blue-600">
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
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </Link>
      </div>
    </>
  );
}
