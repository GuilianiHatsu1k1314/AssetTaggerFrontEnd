import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Sidebar } from "../components/-SideBar";

export const Route = createFileRoute("/adminpages/RegisterUser")({
  component: RegisterUserPage,
});

function RegisterUserPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    role: "Standard User",
    username: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Get the existing list of users from localStorage, or start with an empty array
    const existingUsersString = localStorage.getItem("app_users");
    const existingUsers = existingUsersString
      ? JSON.parse(existingUsersString)
      : [];

    // 2. Check if the username already exists to prevent duplicates
    const userExists = existingUsers.some(
      (u: any) => u.username === formData.username,
    );
    if (userExists) {
      alert("Registration failed: That username already exists!");
      return;
    }

    // 3. Add the new user to the list
    const updatedUsers = [...existingUsers, formData];

    // 4. Save the updated list back to localStorage
    localStorage.setItem("app_users", JSON.stringify(updatedUsers));

    alert(`Successfully registered ${formData.role}: ${formData.username}`);
    navigate({ to: "/adminpages/AdminPage" });
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
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
              Register New User
            </h1>
            <p className="text-sm text-gray-500 md:text-base">
              Create a new account and assign system access.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg md:p-10">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="fullName"
              >
                Employee Full Name
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                id="fullName"
                name="fullName"
                onChange={handleChange}
                placeholder="Juan Dela Cruz"
                required
                type="text"
                value={formData.fullName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                id="username"
                name="username"
                onChange={handleChange}
                placeholder="juandelacruz_123"
                required
                type="text"
                value={formData.username}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="password"
              >
                Temporary Password
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="••••••••"
                required
                type="password"
                value={formData.password}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="role"
              >
                Account Role
              </label>
              <select
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                id="role"
                name="role"
                onChange={handleChange}
                value={formData.role}
              >
                <option value="Standard User">Standard User</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            <div className="mt-4 flex flex-col-reverse justify-end gap-4 sm:flex-row">
              <button
                className="rounded-full border-2 border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                onClick={() => {
                  window.history.back();
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-[#1d4ed8] px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                type="submit"
              >
                Register User
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
