import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Sidebar } from "../components/-SideBar";

export const Route = createFileRoute("/table/Asset")({
  component: AssetPage,
});

// Data Types
type Asset = {
  assetId: string;
  assetTagDate: string;
  purchaseDate: string;
  purchasePrice: string;
  serialNumber: string;
  warrantyDuration: number;
  warrantyUnit: string;
};

const defaultData: Asset[] = [
  {
    assetId: "0001",
    assetTagDate: "1/29/2026",
    purchaseDate: "1/20/2026",
    purchasePrice: "₱20000",
    serialNumber: "SN-9F3K",
    warrantyDuration: 10,
    warrantyUnit: "mm",
  },
  {
    assetId: "0002",
    assetTagDate: "1/22/2026",
    purchaseDate: "1/20/2026",
    purchasePrice: "₱70000",
    serialNumber: "AS-4Q7M",
    warrantyDuration: 5,
    warrantyUnit: "yy",
  },
  {
    assetId: "0004",
    assetTagDate: "10/17/2025",
    purchaseDate: "10/16/2025",
    purchasePrice: "₱3000",
    serialNumber: "A-2049",
    warrantyDuration: 9,
    warrantyUnit: "mm",
  },
  {
    assetId: "0005",
    assetTagDate: "1/9/2026",
    purchaseDate: "1/7/2026",
    purchasePrice: "₱1000",
    serialNumber: "AT-6X2P",
    warrantyDuration: 7,
    warrantyUnit: "dd",
  },
];

const columnHelper = createColumnHelper<Asset>();

const columns = [
  columnHelper.accessor("assetId", {
    header: "AssetID",
    // Link to QR view remains
    cell: (info) => (
      <Link
        to="/table/QRPage"
        className="font-bold underline hover:text-blue-300"
        title="View QR Code"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("assetTagDate", { header: "AssetTag Date" }),
  columnHelper.accessor("purchaseDate", { header: "AssetPurchase Date" }),
  columnHelper.accessor("purchasePrice", { header: "AssetPurchase Price" }),
  columnHelper.accessor("serialNumber", { header: "AssetSerial Number" }),
  columnHelper.accessor("warrantyUnit", {
    header: "AssetWarrantyUnit OfMeasure",
  }),
  columnHelper.accessor("warrantyDuration", {
    header: "AssetWarranty Duration",
  }),
];

function AssetPage() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  const table = useReactTable({
    columns,
    data: defaultData,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handle Row Click
  const handleRowClick = (assetId: string) => {
    if (isEditMode) {
      // Navigate to the edit page with the selected ID
      navigate({ to: "/EditValue", search: { assetId } });
      setIsEditMode(false); // Turn off edit mode after selection
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-xl font-medium text-black">
          <Link className="hover:underline" to="/TableSelection">
            Table Selection
          </Link>
          <span className="mx-2">&gt;</span>
          <span>Table Display</span>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h1 className="text-2xl font-bold text-black">Asset</h1>

          <div className="relative w-full max-w-md">
            {/* Search Input (Visual Only) */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              className="block w-full rounded-full bg-gray-200 py-2 pr-3 pl-10 text-gray-700 placeholder-gray-500 focus:outline-none"
              placeholder="Search in Table"
              type="text"
            />
          </div>

          <div className="flex items-center gap-4 text-black">
            <Link
              to="/AddValue"
              className="flex items-center gap-1 font-medium hover:text-blue-600"
            >
              <span className="text-2xl leading-none font-light">+</span> Add
            </Link>

            {/* EDIT BUTTON: Toggles "Selection Mode" */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-1 rounded px-2 py-1 font-medium transition-colors ${
                isEditMode
                  ? "bg-yellow-400 text-black shadow-md"
                  : "hover:text-blue-600"
              }`}
            >
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="20"
              >
                <path
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              {isEditMode ? "Select Row to Edit" : "Edit"}
            </button>

            <button className="flex items-center gap-1 font-medium hover:text-blue-600">
              <svg
                fill="none"
                height="20"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="20"
              >
                <path
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Table UI */}
        <div
          className={`overflow-hidden rounded-lg shadow-lg transition-all ${isEditMode ? "ring-4 ring-yellow-400" : ""}`}
        >
          <table className="w-full min-w-full table-auto text-left text-sm">
            <thead className="h-16 bg-[#567bfb] text-base font-bold text-black">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th className="px-6 py-4 align-middle" key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-base text-white">
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.original.assetId)}
                  // If Edit Mode is ON, change cursor to pointer and add hover effect
                  className={`${
                    index % 2 === 0 ? "bg-[#1e3a8a]" : "bg-[#567bfb]"
                  } border-b border-blue-400/20 ${
                    isEditMode
                      ? "cursor-pointer transition-colors hover:bg-yellow-500 hover:text-black"
                      : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td className="px-6 py-6 align-middle" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
