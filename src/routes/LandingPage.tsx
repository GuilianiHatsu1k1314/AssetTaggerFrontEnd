import { createFileRoute } from "@tanstack/react-router";

import { Sidebar } from "./components/SideBar"; // Ensure this path matches your project structure

// 1. Single Route Definition
export const Route = createFileRoute("/LandingPage")({
  component: LandingPage,
});

// 2. The Main Page Layout (Sidebar + Dashboard)
function LandingPage() {
  return (
    // Flex Container: Sidebar on Left, Content on Right
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar (Fixed Width) */}
      <Sidebar />

      {/* Main Content Area (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-8">
        <Dashboard />
      </main>
    </div>
  );
}

// ---------------------------------------------------------
// Dashboard & Data Logic (From your snippet)
// ---------------------------------------------------------

// Define Dummy Data
const tableData = [
  { label: "Asset", value: 1 },
  { label: "AssetFix", value: 2 },
  { label: "AssetIssue", value: 3 },
  { label: "AssetTransfer", value: 4 },
  { label: "AssetTransfer", value: 5 },
];

const registeredData = [
  { label: "Asset", value: 10 },
  { label: "AssetFix", value: 25 },
  { label: "AssetIssue", value: 8 },
  { label: "AssetTransfer", value: 42 },
  { label: "AssetTransfer", value: 15 },
];

function Dashboard() {
  return (
    <div className="w-full">
      {/* Dashboard Title with Blue Underline */}
      <div className="mb-8">
        <h1 className="inline-block border-b-4 border-[#007bff] pb-1 text-3xl font-bold text-black">
          Dashboard
        </h1>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Tables */}
        <DashboardCard data={tableData} title="Tables" />

        {/* Card 2: Registered */}
        <DashboardCard data={registeredData} title="Registered" />

        {/* Card 3: Tables (Duplicate per image) */}
        <DashboardCard data={tableData} title="Tables" />
      </div>
    </div>
  );
}

// Reusable Card Component
function DashboardCard({
  data,
  title,
}: {
  data: typeof tableData;
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-[#e5e5e5] shadow-lg">
      {/* Card Header */}
      <div className="border-b border-gray-400 p-4">
        <h3 className="text-xl font-medium text-black">{title}</h3>
      </div>

      {/* Sub-header */}
      <div className="flex justify-end border-b border-gray-400 px-2 py-1">
        <span className="text-[10px] font-bold tracking-tighter text-gray-600 uppercase">
          Amount of Values
        </span>
      </div>

      {/* Data Rows */}
      <div className="flex flex-col">
        {data.map((item, index) => (
          <div
            className={`flex items-center text-black ${
              // Add border-bottom to all except the last item
              index !== data.length - 1 ? "border-b border-gray-400" : ""
            }`}
            key={index}
          >
            {/* Left Column: Label */}
            <div className="flex-1 px-4 py-3 font-medium">{item.label}</div>

            {/* Vertical Divider Line */}
            <div className="w-[1px] self-stretch bg-gray-400"></div>

            {/* Right Column: Value */}
            <div className="w-16 px-4 py-3 text-center font-semibold">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
