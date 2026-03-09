import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
    // Prevent accidental clicks
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete the user "${username}"?`,
    );

    if (!confirmDelete) return;

    // Filter out the deleted user
    const updatedUsers = users.filter((user) => user.username !== username);

    setUsers(updatedUsers); // Update the screen
    localStorage.setItem("app_users", JSON.stringify(updatedUsers)); // Save to database
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
        {/* Header & Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <button
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200"
            onClick={() => {
              window.history.back();
            }}
            title="Go Back"
            type="button"
          >
            <svg
              fill="none"
              height="28"
              stroke="black"
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
            <h1 className="text-2xl font-bold text-black md:text-3xl">
              Manage Users
            </h1>
            <p className="text-sm text-gray-500 md:text-base">
              View, edit roles, or remove registered accounts.
            </p>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white shadow-lg">
          <div className="w-full overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[600px] table-auto text-left text-sm">
              <thead className="bg-[#567bfb] text-base font-bold text-black">
                <tr>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-base">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      className="transition-colors hover:bg-gray-50"
                      key={user.username}
                    >
                      {/* Name */}
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.fullName}
                      </td>

                      {/* Username */}
                      <td className="px-6 py-4 text-gray-600">
                        {user.username}
                      </td>

                      {/* Role Dropdown */}
                      <td className="px-6 py-4">
                        <select
                          className={`cursor-pointer rounded-full border px-3 py-1 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                            user.role === "Admin"
                              ? "border-blue-300 bg-blue-100 text-blue-800"
                              : "border-gray-300 bg-gray-100 text-gray-800"
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
                      <td className="px-6 py-4 text-center">
                        <button
                          className="mx-auto flex items-center justify-center rounded-full p-2 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"
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
                      className="px-6 py-8 text-center text-gray-500"
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
  );
}
