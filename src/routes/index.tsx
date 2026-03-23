import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

// Make sure this path points exactly to where your Context file lives!
import { useDatabase } from "./context/-AssetContext";

import JDNLogo from "/jdnlogowhite.png";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  // Bring in the login function from your secure API context
  const { loginUser } = useDatabase();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // 1. Send credentials to your Express backend (which validates against SQL)
    const success = await loginUser(username, password);

    // 2. If the API returns 200 OK and sets the httpOnly cookie:
    if (success) {
      // (Optional) If you need to store the user's role like your old local storage did,
      // you would decode the JWT here or have your backend return it in the JSON response.
      navigate({ to: "/LandingPage" });
    } else {
      setErrorMessage("Invalid username or password. Please try again.");
    }

    setIsLoading(false);
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
              className="rounded-full bg-[#567bfb] px-8 py-2 font-medium text-white transition-all hover:bg-blue-600 focus:ring-2 focus:outline-none disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
