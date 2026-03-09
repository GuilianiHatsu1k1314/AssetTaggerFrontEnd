import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import JDNLogo from "/jdnlogowhite.png";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Seed default test accounts when the login page loads
  useEffect(() => {
    const existingUsersString = localStorage.getItem("app_users");

    if (!existingUsersString) {
      // If the database is completely empty, create the default accounts
      const defaultUsers = [
        {
          fullName: "System Admin",
          password: "admin123",
          role: "Admin",
          username: "admin",
        },
        {
          fullName: "Test User",
          password: "user123",
          role: "Standard User",
          username: "user",
        },
      ];
      localStorage.setItem("app_users", JSON.stringify(defaultUsers));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Fetch the "database" of users
    const usersString = localStorage.getItem("app_users");
    const users = usersString ? JSON.parse(usersString) : [];

    // 2. Find a user that matches the provided username and password
    const matchedUser = users.find(
      (u: any) => u.username === username && u.password === password,
    );

    // 3. If a match is found, check their role and log them in!
    if (matchedUser) {
      setErrorMessage("");

      if (matchedUser.role === "Admin") {
        // Set admin flag to true
        localStorage.setItem("isAdmin", "true");
      } else {
        // Set admin flag to false
        localStorage.setItem("isAdmin", "false");
      }

      // Optionally save who is currently logged in so you can display their name later
      localStorage.setItem("currentUser", matchedUser.fullName);

      navigate({ to: "/LandingPage" });
    } else {
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-sm flex-col rounded-2xl bg-[#0031AB] p-8 shadow-2xl md:max-w-4xl md:flex-row md:items-center md:justify-between md:gap-16 md:p-12">
        <div className="mb-8 text-center md:mb-0 md:w-1/2 md:text-left">
          <img
            alt="Logo"
            className="mx-auto h-20 w-auto md:mx-0"
            src={JDNLogo}
          />
          <h2 className="mt-2 text-2xl font-medium text-white md:mt-6 md:text-4xl">
            Sign In
          </h2>
        </div>

        <form className="flex flex-col gap-4 md:w-1/2" onSubmit={handleLogin}>
          {errorMessage && (
            <div className="rounded bg-red-100 p-2 text-sm font-semibold text-red-600">
              {errorMessage}
            </div>
          )}

          <input
            className="w-full rounded-md bg-[#d9d9d9] px-4 py-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Username"
            type="text"
            value={username}
          />

          <input
            className="w-full rounded-md bg-[#d9d9d9] px-4 py-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            type="password"
            value={password}
          />

          <div className="mt-2 flex justify-end">
            <button
              className="rounded-full bg-[#567bfb] px-8 py-2 font-medium text-white transition-all hover:bg-blue-600 focus:ring-2 focus:outline-none"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
