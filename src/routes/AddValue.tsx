import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Sidebar } from "./components/-SideBar"; // Adjusted to match standard path
import { useAssetContext } from "./context/-AssetContext"; // Assumes you implemented the context

export const Route = createFileRoute("/AddValue")({
  component: AddAssetPage,
});

// 1. DYNAMIC SCHEMA CONFIGURATION
// Swap this array based on which table the user selected!
const tableColumns = [
  { isReadOnly: true, key: "assetId", label: "Asset ID" },
  { key: "assetTagDate", label: "Asset Tag Date" },
  { key: "purchaseDate", label: "Asset Purchase Date" },
  { key: "purchasePrice", label: "Asset Purchase Price" },
  { key: "serialNumber", label: "Asset Serial Number" },
  { key: "warrantyUnit", label: "Asset Warranty Unit Of Measure" },
  { key: "warrantyDuration", label: "Asset Warranty Duration" },
];
function AddAssetPage() {
  const navigate = useNavigate();
  const { addAsset } = useAssetContext(); // Pull from global context to save data

  // 2. Helper to dynamically generate a blank row based on the schema
  const getBlankRow = () => {
    const blankRow: Record<string, number | string> = {};
    tableColumns.forEach((col) => {
      blankRow[col.key] = "";
    });
    return blankRow;
  };

  // State for multiple rows
  const [rows, setRows] = useState([getBlankRow()]);

  // Handle Input Changes dynamically
  const handleChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  // Add a blank row
  const handleAddRow = () => {
    setRows([...rows, getBlankRow()]);
  };

  // Submit Logic
  const handleSubmit = () => {
    rows.forEach((row) => {
      // Mock ID generation since we don't have a backend yet
      const newAsset = {
        ...row,
        assetId: `0${Math.floor(Math.random() * 10000)}`,
        warrantyDuration: Number(row.warrantyDuration) || 0, // Ensure numbers stay numbers
      } as any;

      addAsset(newAsset);
    });

    alert(`Successfully added ${rows.length} new asset(s)!`);
    navigate({ to: "/table/Asset" }); // Send user back to see their new data
  };

  return (
    <div className="flex h-screen w-full flex-col bg-white md:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
        {/* Breadcrumbs */}
        <div className="mb-8 text-lg font-medium text-black">
          <Link className="hover:underline" to="/TableSelection">
            Table Selection
          </Link>
          <span className="mx-2">&gt;</span>
          <Link className="hover:underline" to="/table/Asset">
            Table Display
          </Link>
          <span className="mx-2">&gt;</span>
          <span>Add New Value</span>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-black">Add New Value</h1>
          <h2 className="text-xl font-semibold text-black">Asset</h2>
        </div>

        {/* Dynamic Input Table Wrapper */}
        <div className="w-full max-w-[1400px] overflow-x-auto rounded-lg shadow-sm">
          {/* CHANGED: Increased min-width to 1200px so 7 columns fit nicely */}
          <div className="min-w-[1200px] md:min-w-full">
            {/* 3. DYNAMIC HEADER ROW */}
            <div
              className="grid gap-2 bg-[#567bfb] px-2 py-6 text-center"
              style={{
                gridTemplateColumns: `repeat(${tableColumns.length}, minmax(0, 1fr))`,
              }}
            >
              {tableColumns.map((col) => (
                <div
                  className="flex items-center justify-center px-1 text-center text-sm font-bold break-words text-black"
                  key={col.key}
                >
                  {/* CHANGED: text-lg to text-sm, added break-words */}
                  {col.label}
                </div>
              ))}
            </div>
            {/* 4. DYNAMIC INPUT ROWS */}
            <div className="space-y-4 bg-[#1e3a8a] px-2 py-4">
              {rows.map((row, index) => (
                <div
                  className="grid items-center gap-2"
                  key={index}
                  style={{
                    gridTemplateColumns: `repeat(${tableColumns.length}, minmax(0, 1fr))`,
                  }}
                >
                  {tableColumns.map((col) => {
                    // If it's the primary key / read-only column, render a placeholder
                    if (col.isReadOnly) {
                      return (
                        <div
                          className="text-center text-sm font-medium text-white/50"
                          key={col.key}
                        >
                          (Auto)
                        </div>
                      );
                    }

                    // Render input fields for all other columns
                    return (
                      <div className="flex justify-center" key={col.key}>
                        <input
                          className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] px-2 py-2 text-center font-medium text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          onChange={(e) => {
                            handleChange(index, col.key, e.target.value);
                          }}
                          placeholder="--Enter--"
                          type={
                            col.key === "warrantyDuration" ? "number" : "text"
                          }
                          value={row[col.key]}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS ROW */}
        <div className="mt-6 flex w-full max-w-[1400px] items-center justify-between">
          <button
            className="flex items-center gap-2 text-xl font-bold text-black transition-colors hover:text-blue-700"
            onClick={handleAddRow}
          >
            <span className="text-3xl leading-none font-light">+</span>
            Create a new row
          </button>

          <button
            className="rounded-full bg-blue-600 px-8 py-2 font-bold text-white shadow-md transition-all hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Add Value
          </button>
        </div>
      </main>
    </div>
  );
}
