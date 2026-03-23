import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ProtectedRoute } from ".././components/-ProtectedRoute"; // 1. IMPORT ADDED HERE (Adjust path if needed based on your folder structure)
import { Sidebar } from "../components/-SideBar";

export const Route = createFileRoute("/adminpages/ManageUser")({
  component: ManageUserPage,
});

function ManageUserPage() {
  // State to hold our list of users
  const [users, setUsers] = useState<any[]>([]);

  // 1. Load users from localStorage when the page opens
  useEffect(() => {
    const storedUsers = localStorage.getItem("app_users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  // 2. Handle Role Change
  const handleRoleChange = (username: string, newRole: string) => {
    const updatedUsers = users.map((user) =>
      user.username === username ? { ...user, role: newRole } : user,
    );

    setUsers(updatedUsers); // Update the screen
    localStorage.setItem("app_users", JSON.stringify(updatedUsers)); // Save to database
  };

  // 3. Handle User Deletion
  const handleDeleteUser = (username: string) => {
    // FIXED: Removed the nested backticks and replaced them with single quotes
    // so the popup will say: Are you sure you want to permanently delete the user 'username'?
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete the user '${username}'?`,
    );

    if (!confirmDelete) return;

    // Filter out the deleted user
    const updatedUsers = users.filter((user) => user.username !== username);

    setUsers(updatedUsers); // Update the screen
    localStorage.setItem("app_users", JSON.stringify(updatedUsers)); // Save to database
  };

  return (
    // 2. WRAPPER ADDED HERE
    <ProtectedRoute>
      <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
          {/* Header & Back Button */}
          <div className="mb-8 flex items-center gap-4">
            <button
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onClick={() => {
                window.history.back();
              }}
              title="Go Back"
              type="button"
            >
              <svg
                fill="none"
                height="28"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="28"
              >
                <line x1="19" x2="5" y1="12" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                Manage Users
              </h1>
              <p className="mt-1 text-sm text-gray-500 md:text-base">
                View, edit roles, or remove registered accounts from the system.
              </p>
            </div>
          </div>

          {/* Modern Users Table Card */}
          <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[700px] table-auto text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Full Name
                    </th>
                    <th className="px-6 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Username
                    </th>
                    <th className="px-6 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Current Role
                    </th>
                    <th className="px-6 py-4 text-center align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white text-base">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        className="transition-colors hover:bg-gray-50"
                        key={user.username}
                      >
                        {/* Name */}
                        <td className="px-6 py-4 align-middle font-medium text-gray-900">
                          {user.fullName}
                        </td>

                        {/* Username */}
                        <td className="px-6 py-4 align-middle text-gray-600">
                          {user.username}
                        </td>

                        {/* Role Dropdown */}
                        <td className="px-6 py-4 align-middle">
                          <select
                            className={`cursor-pointer rounded-md border px-3 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                              user.role === "Admin"
                                ? "border-blue-200 bg-blue-50 text-blue-800"
                                : "border-gray-300 bg-white text-gray-700"
                            }`}
                            onChange={(e) => {
                              handleRoleChange(user.username, e.target.value);
                            }}
                            value={user.role}
                          >
                            <option value="Standard User">Standard User</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>

                        {/* Delete Action */}
                        <td className="px-6 py-4 text-center align-middle">
                          <button
                            className="mx-auto flex items-center justify-center rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                            onClick={() => {
                              handleDeleteUser(user.username);
                            }}
                            title="Delete User"
                          >
                            <svg
                              fill="none"
                              height="20"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              width="20"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" x2="10" y1="11" y2="17"></line>
                              <line x1="14" x2="14" y1="11" y2="17"></line>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-6 py-12 text-center text-gray-500"
                        colSpan={4}
                      >
                        No users found. Go to the Register page to add someone!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
