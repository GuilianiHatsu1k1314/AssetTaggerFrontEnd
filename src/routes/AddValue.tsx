import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Sidebar } from "./components/-SideBar";
import { useAssetContext } from "./context/-AssetContext";

export const Route = createFileRoute("/AddValue")({
  component: AddAssetPage,
});

// 1. DYNAMIC SCHEMA CONFIGURATION
const tableColumns = [
  {
    isReadOnly: true,
    key: "assetId",
    label: "Asset ID",
    placeholder: "(Auto)",
  },
  { key: "assetTagDate", label: "Tag Date", placeholder: "MM/DD/YYYY" },
  { key: "purchaseDate", label: "Purchase Date", placeholder: "MM/DD/YYYY" },
  { key: "purchasePrice", label: "Purchase Price", placeholder: "e.g. 20000" },
  { key: "serialNumber", label: "Serial Number", placeholder: "e.g. SN-9F3K" },
  {
    key: "warrantyUnit",
    label: "Warranty Unit",
    options: [
      { label: "mm (Month)", value: "mm" },
      { label: "yy (Year)", value: "yy" },
    ],
  },
  {
    key: "warrantyDuration",
    label: "Warranty Duration",
    placeholder: "e.g. 12",
  },
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
      alert("Please fill out all required fields in all rows before saving.");
      return;
    }

    rows.forEach((row) => {
      // If the user used the date picker, the format will be YYYY-MM-DD.
      // We optionally convert it back to MM/DD/YYYY to match your other screens
      const formatToUSDate = (dateStr: string) => {
        if (!dateStr?.includes("-")) return dateStr;
        const [year, month, day] = dateStr.split("-");
        return `${month}/${day}/${year}`;
      };

      const newAsset = {
        ...row,
        assetId: `0${Math.floor(Math.random() * 10000)}`,
        assetTagDate: formatToUSDate(String(row.assetTagDate)),
        purchaseDate: formatToUSDate(String(row.purchaseDate)),
        warrantyDuration: Number(row.warrantyDuration) || 0,
      } as any;

      addAsset(newAsset);
    });

    alert(`Successfully added ${rows.length} new asset(s)!`);
    navigate({ to: "/table/Asset" });
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 md:text-base">
          <Link
            className="hover:text-blue-600 hover:underline"
            to="/TableSelection"
          >
            Table Selection
          </Link>
          <span>/</span>
          <Link
            className="hover:text-blue-600 hover:underline"
            to="/table/Asset"
          >
            Table Display
          </Link>
          <span>/</span>
          <span className="text-gray-900">Add New Value</span>
        </div>

        {/* Header Section with Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <button
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onClick={() => {
              window.history.back();
            }}
          >
            <svg
              className="md:h-8 md:w-8"
              fill="none"
              height="28"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="28"
            >
              <line x1="19" x2="5" y1="12" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Add New Assets
            </h1>
            <p className="mt-1 text-sm text-gray-500 md:text-base">
              Fill out the rows below to register new assets into the system.
            </p>
          </div>
        </div>

        {/* Dynamic Input Table Card */}
        <div className="w-full max-w-[1400px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] table-auto text-left text-sm">
              {/* Table Header */}
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {tableColumns.map((col) => (
                    <th
                      className="px-4 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase"
                      key={col.key}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body (Input Rows) */}
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((row, index) => (
                  <tr
                    className="transition-colors hover:bg-gray-50"
                    key={index}
                  >
                    {tableColumns.map((col) => {
                      // 1. READ ONLY FIELDS (Asset ID)
                      if (col.isReadOnly) {
                        return (
                          <td className="px-4 py-3 align-middle" key={col.key}>
                            <div className="flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400">
                              {col.placeholder || "(Auto)"}
                            </div>
                          </td>
                        );
                      }

                      // 2. DROPDOWN FIELDS (Warranty Unit)
                      if (col.options) {
                        return (
                          <td className="px-4 py-3 align-middle" key={col.key}>
                            <select
                              className="w-full min-w-[140px] cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                              onChange={(e) => {
                                handleChange(index, col.key, e.target.value);
                              }}
                              value={row[col.key]}
                            >
                              <option disabled value="">
                                -- Select --
                              </option>
                              {col.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      }

                      // 3. DATE FIELDS (Tag Date, Purchase Date)
                      if (col.label.includes("Date")) {
                        return (
                          <td className="px-4 py-3 align-middle" key={col.key}>
                            <input
                              className="w-full min-w-[140px] cursor-text rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                              onChange={(e) => {
                                handleChange(index, col.key, e.target.value);
                              }}
                              type="date"
                              value={row[col.key]}
                            />
                          </td>
                        );
                      }

                      // 4. STANDARD TEXT/NUMBER INPUTS
                      return (
                        <td className="px-4 py-3 align-middle" key={col.key}>
                          <input
                            className="w-full min-w-[140px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            onChange={(e) => {
                              handleChange(index, col.key, e.target.value);
                            }}
                            placeholder={col.placeholder || "Enter value..."}
                            type={
                              col.key === "warrantyDuration" ? "number" : "text"
                            }
                            value={row[col.key]}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button (Attached to bottom of table) */}
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <button
              className="group flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-500 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
              onClick={handleAddRow}
            >
              <svg
                className="transition-transform group-hover:scale-110"
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
              >
                <line x1="12" x2="12" y1="5" y2="19"></line>
                <line x1="5" x2="19" y1="12" y2="12"></line>
              </svg>
              Add Another Row
            </button>
          </div>
        </div>

        {/* Final Action / Submit */}
        <div className="mt-8 flex w-full max-w-[1400px] justify-end">
          <button
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            onClick={handleSubmit}
          >
            <svg
              fill="none"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Assets
          </button>
        </div>
      </main>
    </div>
  );
}
