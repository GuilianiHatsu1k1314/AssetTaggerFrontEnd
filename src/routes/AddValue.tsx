import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Sidebar } from "./components/-SideBar";
import { useAssetContext } from "./context/-AssetContext";

export const Route = createFileRoute("/AddValue")({
  component: AddAssetPage,
});

// 1. DYNAMIC SCHEMA CONFIGURATION
// I added an 'options' array to the warrantyUnit column.
const tableColumns = [
  { isReadOnly: true, key: "assetId", label: "Asset ID" },
  { key: "assetTagDate", label: "Asset Tag Date" },
  { key: "purchaseDate", label: "Asset Purchase Date" },
  { key: "purchasePrice", label: "Asset Purchase Price" },
  { key: "serialNumber", label: "Asset Serial Number" },
  {
    key: "warrantyUnit",
    label: "Asset Warranty Unit Of Measure",
    // This tells our code to render a dropdown instead of a text box
    options: [
      { label: "mm (Month)", value: "mm" },
      { label: "yy (Year)", value: "yy" },
    ],
  },
  { key: "warrantyDuration", label: "Asset Warranty Duration" },
];

function AddAssetPage() {
  const navigate = useNavigate();
  const { addAsset } = useAssetContext();

  const getBlankRow = () => {
    const blankRow: Record<string, number | string> = {};
    tableColumns.forEach((col) => {
      blankRow[col.key] = "";
    });
    return blankRow;
  };

  const [rows, setRows] = useState([getBlankRow()]);

  const handleChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, getBlankRow()]);
  };

  const handleSubmit = () => {
    let isValid = true;

    for (const row of rows) {
      for (const col of tableColumns) {
        if (!col.isReadOnly) {
          const value = row[col.key];
          if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
          ) {
            isValid = false;
            break;
          }
        }
      }
      if (!isValid) break;
    }

    if (!isValid) {
      alert("Please fill out all fields in all rows before saving.");
      return;
    }

    rows.forEach((row) => {
      const newAsset = {
        ...row,
        assetId: `0${Math.floor(Math.random() * 10000)}`,
        warrantyDuration: Number(row.warrantyDuration) || 0,
      } as any;

      addAsset(newAsset);
    });

    alert(`Successfully added ${rows.length} new asset(s)!`);
    navigate({ to: "/table/Asset" });
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
          <div className="min-w-[1200px] md:min-w-full">
            {/* Header Row */}
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
                  {col.label}
                </div>
              ))}
            </div>

            {/* Input Rows */}
            <div className="space-y-4 bg-[#1e3a8a] px-2 py-4">
              {rows.map((row, index) => (
                <div className="grid items-center gap-2" key={index}>
                  <div
                    className="grid items-center gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${tableColumns.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {tableColumns.map((col) => {
                      // 1. READ ONLY FIELDS (Asset ID)
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

                      // 2. DROPDOWN FIELDS (Warranty Unit)
                      // If the column has an 'options' array, render a <select>
                      if (col.options) {
                        return (
                          <div className="flex justify-center" key={col.key}>
                            <select
                              className="w-full max-w-[140px] cursor-pointer appearance-none rounded-sm bg-[#dcdcdc] px-2 py-2 text-center font-medium text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                              onChange={(e) => {
                                handleChange(index, col.key, e.target.value);
                              }}
                              value={row[col.key]}
                            >
                              <option value="">--Select--</option>
                              {col.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }

                      // 3. STANDARD TEXT/NUMBER INPUTS
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
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
