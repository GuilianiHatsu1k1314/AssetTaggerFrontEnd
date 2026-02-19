import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "./components/-SideBar";

export const Route = createFileRoute("/AddValue")({
  component: AddAssetPage,
});

function AddAssetPage() {
  const navigate = useNavigate();

  // State for multiple rows
  const [rows, setRows] = useState([
    { assetId: "", tagDate: "", purchaseDate: "", purchasePrice: "" },
  ]);

  // Handle Input Changes
  const handleChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  // Add a blank row
  const handleAddRow = () => {
    setRows([
      ...rows,
      { assetId: "", tagDate: "", purchaseDate: "", purchasePrice: "" },
    ]);
  };

  // Submit Logic
  const handleSubmit = () => {
    console.log("Submitting Rows:", rows);
    alert(`Successfully added ${rows.length} new asset(s)!`);
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Breadcrumbs */}
        <div className="mb-8 text-lg font-medium text-black">
          <Link to="/TableSelection" className="hover:underline">
            Table Selection
          </Link>
          <span className="mx-2">&gt;</span>
          <Link to="/table/Asset" className="hover:underline">
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

        {/* Dynamic Input Table */}
        <div className="w-full max-w-5xl overflow-hidden rounded-lg shadow-sm">
          {/* Header Row (Light Blue) */}
          <div className="grid grid-cols-4 gap-4 bg-[#567bfb] px-4 py-6">
            <div className="text-center text-xl font-bold text-black">
              AssetID
            </div>
            <div className="text-center text-xl font-bold text-black">
              AssetTag
              <br />
              Date
            </div>
            <div className="text-center text-xl font-bold text-black">
              AssetPurchase
              <br />
              Date
            </div>
            <div className="text-center text-xl font-bold text-black">
              AssetPurchase
              <br />
              Price
            </div>
          </div>

          {/* Rows Container (Dark Blue Background) */}
          <div className="space-y-4 bg-[#1e3a8a] px-4 py-4">
            {rows.map((row, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                {/* AssetID (Placeholder) */}
                <div className="text-center text-sm text-white/50"></div>

                {/* Tag Date Input */}
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={row.tagDate}
                    onChange={(e) =>
                      handleChange(index, "tagDate", e.target.value)
                    }
                    placeholder="--Enter--"
                    className="w-32 rounded-sm bg-[#dcdcdc] px-2 py-1 text-center font-medium text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                {/* Purchase Date Input */}
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={row.purchaseDate}
                    onChange={(e) =>
                      handleChange(index, "purchaseDate", e.target.value)
                    }
                    placeholder="--Enter--"
                    className="w-32 rounded-sm bg-[#dcdcdc] px-2 py-1 text-center font-medium text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                {/* Purchase Price Input */}
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={row.purchasePrice}
                    onChange={(e) =>
                      handleChange(index, "purchasePrice", e.target.value)
                    }
                    placeholder="--Enter--"
                    className="w-32 rounded-sm bg-[#dcdcdc] px-2 py-1 text-center font-medium text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS ROW: "Create new row" (Left) | "Add Value" (Right) */}
        <div className="mt-6 flex w-full max-w-5xl items-center justify-between">
          {/* Create Row Button */}
          <button
            onClick={handleAddRow}
            className="flex items-center gap-2 text-xl font-bold text-black transition-colors hover:text-blue-700"
          >
            <span className="text-3xl leading-none font-light">+</span>
            Create a new row
          </button>

          {/* Add Value Button (Moved Here) */}
          <button
            onClick={handleSubmit}
            className="rounded-full bg-blue-600 px-8 py-2 font-bold text-white shadow-md transition-all hover:bg-blue-700"
          >
            Add Value
          </button>
        </div>
      </main>
    </div>
  );
}
