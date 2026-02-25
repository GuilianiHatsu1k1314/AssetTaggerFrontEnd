import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { Sidebar } from "../components/-SideBar";
import { useAssetContext } from "../context/-AssetContext";

export const Route = createFileRoute("/table/Asset")({
  component: AssetPage,
});

// Data Types
interface Asset {
  assetId: string;
  assetTagDate: string;
  purchaseDate: string;
  purchasePrice: string;
  serialNumber: string;
  warrantyDuration: number;
  warrantyUnit: string;
}

const columnHelper = createColumnHelper<Asset>();

const columns = [
  columnHelper.accessor("assetId", {
    cell: (info) => (
      <Link
        className="font-bold underline hover:text-blue-300"
        search={{ assetId: info.getValue() }}
        title="View QR Code"
        to="/table/QRPage"
      >
        {info.getValue()}
      </Link>
    ),
    header: "AssetID",
  }),
  columnHelper.accessor("assetTagDate", {
    header: "AssetTagDate",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("purchaseDate", {
    header: "AssetPurchaseDate",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("purchasePrice", {
    header: "AssetPurchasePrice",
    sortingFn: (rowA, rowB, columnId) => {
      const a = Number(
        rowA.getValue<string>(columnId).replace(/[^0-9.-]+/g, ""),
      );
      const b = Number(
        rowB.getValue<string>(columnId).replace(/[^0-9.-]+/g, ""),
      );
      return a < b ? -1 : a > b ? 1 : 0;
    },
  }),
  columnHelper.accessor("serialNumber", { header: "AssetSerialNumber" }),
  columnHelper.accessor("warrantyUnit", {
    header: "AssetWarrantyUnitOfMeasure",
  }),
  columnHelper.accessor("warrantyDuration", {
    header: "AssetWarrantyDuration",
  }),
];

function AssetPage() {
  const { assets } = useAssetContext();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data: assets,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const handleRowClick = (assetId: string) => {
    if (isEditMode) {
      navigate({ search: { assetId }, to: "/EditValue" });
      setIsEditMode(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-lg font-medium text-black md:text-xl">
          <Link className="hover:underline" to="/TableSelection">
            Table Selection
          </Link>
          <span className="mx-2">&gt;</span>
          <span>Table Display</span>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h1 className="text-2xl font-bold text-black">Asset</h1>

          <div className="relative w-full md:max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <input
              className="block w-full rounded-full bg-gray-200 py-2 pr-3 pl-10 text-gray-700 placeholder-gray-500 focus:outline-none"
              placeholder="Search in Table"
              type="text"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-black">
            <Link
              className="flex items-center gap-1 font-medium hover:text-blue-600"
              to="/AddValue"
            >
              <span className="text-2xl leading-none font-light">+</span> Add
            </Link>

            <button
              className={`flex items-center gap-1 rounded px-2 py-1 font-medium transition-colors ${
                isEditMode
                  ? "bg-yellow-400 text-black shadow-md"
                  : "hover:text-blue-600"
              }`}
              onClick={() => {
                setIsEditMode(!isEditMode);
              }}
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

            {/* FILTER DROPDOWN CONTAINER */}
            <div className="relative">
              <button
                className="flex items-center gap-1 font-medium hover:text-blue-600 focus:outline-none"
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                }}
              >
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

              {/* DROPDOWN MENU */}
              {isFilterOpen && (
                <div className="ring-opacity-5 absolute top-full right-0 z-50 mt-2 w-56 rounded-md bg-white py-2 shadow-xl ring-1 ring-black">
                  <div className="px-4 py-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Sort By
                  </div>

                  <SortMenuItem
                    columnId="assetTagDate"
                    label="Tag Date"
                    table={table}
                  />
                  <SortMenuItem
                    columnId="purchaseDate"
                    label="Purchase Date"
                    table={table}
                  />
                  <SortMenuItem
                    columnId="purchasePrice"
                    label="Purchase Price"
                    table={table}
                  />
                  <SortMenuItem
                    columnId="warrantyDuration"
                    label="Warranty Duration"
                    table={table}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table UI Wrapper */}
        <div
          className={`w-full overflow-x-auto rounded-lg shadow-lg transition-all ${isEditMode ? "ring-4 ring-yellow-400" : ""}`}
        >
          <table className="w-full min-w-200 table-auto text-left text-sm md:min-w-full">
            <thead className="h-16 bg-[#567bfb] text-base font-bold text-black">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="px-6 py-4 align-middle whitespace-nowrap"
                      key={header.id}
                    >
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
                  className={`${index % 2 === 0 ? "bg-[#1e3a8a]" : "bg-[#567bfb]"} border-b border-blue-400/20 ${
                    isEditMode
                      ? "cursor-pointer transition-colors hover:bg-yellow-500 hover:text-black"
                      : ""
                  }`}
                  key={row.id}
                  onClick={() => {
                    handleRowClick(row.original.assetId);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className="px-6 py-6 align-middle whitespace-nowrap"
                      key={cell.id}
                    >
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

function SortMenuItem({
  columnId,
  label,
  table,
}: {
  columnId: string;
  label: string;
  table: any;
}) {
  const column = table.getColumn(columnId);
  const isSorted = column?.getIsSorted();

  return (
    <button
      className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50"
      onClick={() => column?.toggleSorting()}
    >
      <span>{label}</span>
      <span className="w-4 text-center font-bold text-blue-600">
        {isSorted === "asc" ? "↑" : isSorted === "desc" ? "↓" : ""}
      </span>
    </button>
  );
}
