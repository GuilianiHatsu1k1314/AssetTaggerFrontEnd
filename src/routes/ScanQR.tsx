import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "./components/-SideBar"; // Adjust path if needed

// 1. Create Route matching the Sidebar link
export const Route = createFileRoute("/ScanQR")({
  component: ScanQRPage,
});

function ScanQRPage() {
  return (
    // Main Layout Wrapper
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header: Back Button & Title */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200"
          >
            {/* Back Arrow Icon */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 className="text-3xl font-medium text-black">Scan QR</h1>
        </div>

        {/* Center Container for the Scanning Card */}
        <div className="mt-10 flex items-start justify-center">
          {/* The Blue Card */}
          <div className="relative flex aspect-square w-full max-w-md flex-col items-center justify-center bg-[#567bfb] p-12 shadow-xl">
            {/* Gray Camera Box */}
            <div className="flex h-64 w-64 items-center justify-center border border-gray-400 bg-[#dcdcdc] shadow-inner">
              {/* Camera Icon */}
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-80"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>

            {/* "Scan Again" Text */}
            <button className="mt-8 text-lg font-medium text-black transition-all hover:underline">
              Scan Again
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
