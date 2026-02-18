import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Sidebar } from "./components/SideBar"; // Ensure this path matches your project structure

// 1. Single Route Definition
export const Route = createFileRoute("/TableSelection")({
  component: TableSelection,
});

function TableSelection() {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Table Selection</h1>
        </div>

        <div className="relative min-h-[350px] w-full max-w-3xl rounded-lg bg-[#567bfb] p-8 shadow-xl">
          <h2 className="mb-4 text-xl font-medium text-black">
            Select Table to Display
          </h2>
          <Dropdown />
        </div>
      </main>
    </div>
  );
}

// ... (Keep your Dropdown component code below this)
const options = ["Asset", "AssetFix", "AssetIssue", "AssetTransfer"];

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("--Select--");

  // 2. Initialize the navigation hook
  const navigate = useNavigate();

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);

    // 3. Add the navigation logic here
    // This will take the user to "/Asset", "/AssetFix", etc.
    // If you want them to go to "/tables/Asset", change it to: to: `/tables/${option}`
    navigate({ to: `/${option}` });
  };

  return (
    <div className="relative w-72">
      <button
        className="flex w-full items-center justify-between border-2 border-blue-700 bg-[#e5e5e5] px-4 py-2 text-left font-medium text-black shadow-sm transition-colors hover:bg-gray-300"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {selected}
        <svg
          className={`h-5 w-5 text-black transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
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

      {isOpen && (
        <div className="absolute top-full left-0 z-10 mt-1 w-full bg-[#dcdcdc] py-1 shadow-lg">
          {options.map((option, index) => (
            <div
              className="cursor-pointer px-4 py-2 font-medium text-black hover:bg-gray-400"
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
