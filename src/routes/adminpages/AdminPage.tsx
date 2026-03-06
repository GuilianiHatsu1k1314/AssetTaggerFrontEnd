import { createFileRoute, Link } from "@tanstack/react-router";

import { Sidebar } from "../components/-SideBar";

export const Route = createFileRoute("/adminpages/AdminPage")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    // Responsive main wrapper: flex-col on mobile, flex-row on desktop
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      {/* Include the Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 pb-28 md:p-12">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-black md:text-5xl">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Select an action below to manage system users and application data.
          </p>
        </div>

        {/* Action Buttons / Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* 1. Register Users */}
          <Link
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-transparent bg-white p-10 text-center shadow-lg transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl"
            to="/adminpages/RegisterUser"
          >
            <div className="mb-6 rounded-full bg-[#e0e7ff] p-5 text-[#1d4ed8] transition-colors group-hover:bg-[#1d4ed8] group-hover:text-white">
              <svg
                fill="none"
                height="48"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="48"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" x2="20" y1="8" y2="14" />
                <line x1="23" x2="17" y1="11" y2="11" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black">Register Users</h2>
            <p className="mt-2 text-gray-500">
              Create new accounts and assign specific access roles.
            </p>
          </Link>

          {/* 2. Manage Users */}
          <Link
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-transparent bg-white p-10 text-center shadow-lg transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl"
            to="/adminpages/ManageUser"
          >
            <div className="mb-6 rounded-full bg-[#e0e7ff] p-5 text-[#1d4ed8] transition-colors group-hover:bg-[#1d4ed8] group-hover:text-white">
              <svg
                fill="none"
                height="48"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="48"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black">Manage Users</h2>
            <p className="mt-2 text-gray-500">
              View, edit, suspend, or delete existing system users.
            </p>
          </Link>

          {/* 3. Manage Tables */}
          <Link
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-transparent bg-white p-10 text-center shadow-lg transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl"
            to="/adminpages/ManageTable"
          >
            <div className="mb-6 rounded-full bg-[#e0e7ff] p-5 text-[#1d4ed8] transition-colors group-hover:bg-[#1d4ed8] group-hover:text-white">
              <svg
                fill="none"
                height="48"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="48"
              >
                <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                <line x1="3" x2="21" y1="9" y2="9" />
                <line x1="3" x2="21" y1="15" y2="15" />
                <line x1="9" x2="9" y1="9" y2="21" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black">Manage Tables</h2>
            <p className="mt-2 text-gray-500">
              Configure database table formats and column structures.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
