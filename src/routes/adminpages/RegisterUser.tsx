import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Sidebar } from "../components/-SideBar";

export const Route = createFileRoute("/adminpages/RegisterUser")({
  component: RegisterUserPage,
});

function RegisterUserPage() {
  const navigate = useNavigate();

  // State to hold the new user's information
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    role: "Standard User",
    username: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here is where you would normally send the data to your backend/API
    console.log("Registering new user:", formData);
    alert(`Successfully registered ${formData.role}: ${formData.username}`);

    // Redirect back to the Admin Dashboard after successful registration
    navigate({ to: "/adminpages/AdminPage" });
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
              Register New User
            </h1>
            <p className="text-sm text-gray-500 md:text-base">
              Create a new account and assign system access.
            </p>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg md:p-10">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-gray-700"
                htmlFor="fullName"
              >
                Full Name
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

            {/* Username Input */}
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

            {/* Password Input */}
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

            {/* Role Dropdown */}
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
                <option value="Standard User">User</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            {/* Action Buttons */}
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
