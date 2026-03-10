import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Sidebar } from "./components/-SideBar"; // Ensure this path matches your project structure

export const Route = createFileRoute("/TableSelection")({
  component: TableSelection,
});

function TableSelection() {
  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Table Selection
          </h1>
          <p className="mt-2 text-base text-gray-500 md:text-lg">
            Choose a database category below to view and manage its records.
          </p>
        </div>

        {/* Modernized Card */}
        <div className="mx-auto flex min-h-[400px] w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:p-12">
          {/* Decorative Icon */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-[#567bfb]">
            <svg
              fill="none"
              height="40"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="40"
            >
              <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
              <line x1="3" x2="21" y1="9" y2="9" />
              <line x1="3" x2="21" y1="15" y2="15" />
              <line x1="9" x2="9" y1="9" y2="21" />
            </svg>
          </div>

          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Select Table to Display
          </h2>

          <Dropdown />
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Dropdown Component
// ----------------------------------------------------------------------------
const options = ["Asset", "AssetFix", "AssetIssue", "AssetTransfer"];

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("-- Select a Table --");

  const navigate = useNavigate();

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    navigate({ to: `/table/${option}` });
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Dropdown Button */}
      <button
        className="focus:ring-opacity-50 flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-5 py-4 text-left font-medium text-gray-700 shadow-sm transition-all hover:border-[#567bfb] focus:border-[#567bfb] focus:ring-2 focus:ring-[#567bfb] focus:outline-none"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span
          className={
            selected.includes("--") ? "text-gray-400" : "text-gray-900"
          }
        >
          {selected}
        </span>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#567bfb]" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-10 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
          {options.map((option, index) => (
            <div
              className="cursor-pointer px-5 py-3 font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-[#567bfb]"
              key={index}
              onClick={() => {
                handleSelect(option);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
