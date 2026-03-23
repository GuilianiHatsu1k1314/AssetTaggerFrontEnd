import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { ProtectedRoute } from ".././components/-ProtectedRoute"; // 1. IMPORT ADDED HERE
import { Sidebar } from "../components/-SideBar"; // <-- Adjust if needed

export const Route = createFileRoute("/adminpages/ManageTable")({
  component: ManageTableWIP,
});

function ManageTableWIP() {
  const navigate = useNavigate();

  return (
    // 2. WRAPPER ADDED HERE
    <ProtectedRoute>
      <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
        <Sidebar />

        {/* Main Content Area - Centered */}
        <main className="flex flex-1 flex-col items-center justify-center p-6 pb-28 md:p-12">
          <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-2xl md:p-16">
            {/* Animated Gear Icon */}
            <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-blue-50 text-[#1d4ed8]">
              <svg
                className="h-16 w-16 animate-[spin_4s_linear_infinite]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </div>

            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
              Work in Progress
            </h1>

            <p className="mb-8 text-lg text-gray-500">
              We are currently building out the{" "}
              <span className="font-semibold text-[#1d4ed8]">
                Table Management
              </span>{" "}
              features. Check back soon!
            </p>

            <button
              className="group flex items-center justify-center gap-2 rounded-full bg-[#1d4ed8] px-8 py-3 text-lg font-medium text-white shadow-md transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              onClick={() => {
                window.history.back();
              }}
            >
              <svg
                className="transition-transform group-hover:-translate-x-1"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
              >
                <line x1="19" x2="5" y1="12" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Go Back
            </button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
