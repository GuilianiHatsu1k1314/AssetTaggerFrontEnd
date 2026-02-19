import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/LandingPage" });
  };

  return (
    // Full Screen Centered Container
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      {/* The Blue Card 
        - Mobile: flex-col, max-w-sm (narrow)
        - Desktop (md:): flex-row, max-w-3xl (wide), gap-12
      */}
      <div className="flex w-full max-w-sm flex-col rounded-2xl bg-[#1e439b] p-8 shadow-2xl md:max-w-4xl md:flex-row md:items-center md:justify-between md:gap-16 md:p-12">
        {/* Left Side (Logo & Title) */}
        <div className="mb-8 text-center md:mb-0 md:w-1/2 md:text-left">
          <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl">
            JDN
          </h1>
          <h2 className="mt-2 text-2xl font-medium text-white md:mt-6 md:text-4xl">
            Sign In
          </h2>
        </div>

        {/* Right Side (Form Inputs) */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4 md:w-1/2">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-md bg-[#d9d9d9] px-4 py-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md bg-[#d9d9d9] px-4 py-3 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />

          {/* Login Button Aligned to Right */}
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              // CHANGED: Removed the dark gray mobile color and made it universally blue (#567bfb)
              className="rounded-full bg-[#567bfb] px-8 py-2 font-medium text-white transition-all hover:bg-blue-600 focus:ring-2 focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
