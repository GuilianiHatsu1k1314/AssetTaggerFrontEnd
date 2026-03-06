import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  // 1. Add state to hold the input values and error messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Check for ADMIN credentials
    if (username === "admin" && password === "admin123") {
      setErrorMessage("");

      // SAVE ADMIN FLAG: This tells the Sidebar to show the Admin link
      localStorage.setItem("isAdmin", "true");

      navigate({ to: "/LandingPage" });
    }
    // 3. Check for REGULAR USER credentials (for testing the hidden link)
    else if (username === "user" && password === "user123") {
      setErrorMessage("");

      // SAVE NON-ADMIN FLAG: This tells the Sidebar to hide the Admin link
      localStorage.setItem("isAdmin", "false");

      navigate({ to: "/LandingPage" });
    }
    // 4. Handle incorrect credentials
    else {
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  return (
    // Full Screen Centered Container
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      {/* The Blue Card */}
      <div className="flex w-full max-w-sm flex-col rounded-2xl bg-[#0031AB] p-8 shadow-2xl md:max-w-4xl md:flex-row md:items-center md:justify-between md:gap-16 md:p-12">
        {/* Left Side (Logo & Title) */}
        <div className="mb-8 text-center md:mb-0 md:w-1/2 md:text-left">
          <img
            alt="Logo"
            className="h-20 w-auto"
            src="public\jdnlogowhite.png"
          />
          <h2 className="mt-2 text-2xl font-medium text-white md:mt-6 md:text-4xl">
            Sign In
          </h2>
        </div>

        {/* Right Side (Form Inputs) */}
        <form className="flex flex-col gap-4 md:w-1/2" onSubmit={handleLogin}>
          {/* Error Message Display */}
          {errorMessage && (
            <div className="rounded bg-red-100 p-2 text-sm font-semibold text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Connect inputs to state */}
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

          {/* Login Button Aligned to Right */}
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
