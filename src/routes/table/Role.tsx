import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { Sidebar } from "../components/-SideBar";

export const Route = createFileRoute("/table/Role")({
  component: RolePage,
});

// 1. DATA TYPES BASED ON Role.sql SCHEMA
interface Role {
  roleId: string; // UNIQUEIDENTIFIER (PK)
  roleInsertDate: string; // DATETIME
  roleName: string; // NVARCHAR(4000)
}

// Dummy data to populate the table for testing UI
const mockData: Role[] = [
  {
    roleId: "ROLE-1001",
    roleInsertDate: "01/10/2026",
    roleName: "System Administrator",
  },
  {
    roleId: "ROLE-1002",
    roleInsertDate: "01/12/2026",
    roleName: "IT Support Specialist",
  },
  {
    roleId: "ROLE-1003",
    roleInsertDate: "02/05/2026",
    roleName: "Department Manager",
  },
  {
    roleId: "ROLE-1004",
    roleInsertDate: "03/01/2026",
    roleName: "Standard Employee",
  },
];

const columnHelper = createColumnHelper<Role>();

// 2. COLUMNS CONFIGURED FOR SQL SCHEMA
const columns = [
  columnHelper.accessor("roleId", {
    cell: (info) => (
      <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm font-semibold text-gray-500">
        {info.getValue()}
      </span>
    ),
    header: "Role ID",
  }),
  columnHelper.accessor("roleName", {
    cell: (info) => (
      <span className="font-bold text-blue-600">{info.getValue()}</span>
    ),
    header: "Role Name",
  }),
  columnHelper.accessor("roleInsertDate", {
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    header: "Date Added",
    sortingFn: "datetime",
  }),
];

function RolePage() {
  // Using local state for now until context/API is connected
  const [roles] = useState<Role[]>(mockData);
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data: roles,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const handleRowClick = (roleId: string) => {
    if (isEditMode) {
      navigate({
        search: { id: roleId, tableName: "Role" },
        to: "/EditValue" as any,
      });
      setIsEditMode(false);
    }
  };
  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 md:text-base">
          <Link
            className="hover:text-blue-600 hover:underline"
            to="/TableSelection"
          >
            Table Selection
          </Link>
          <span>/</span>
          <span className="text-gray-900">Role Display</span>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Role Table
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage employee job titles and organizational roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
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
                className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Search roles..."
                type="text"
              />
            </div>

            {/* Add Button */}
            <Link
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              to={`/AddValue?tableName=Role`}
            >
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
              >
                <line x1="12" x2="12" y1="5" y2="19"></line>
                <line x1="5" x2="19" y1="12" y2="12"></line>
              </svg>
              Add Role
            </Link>

            {/* Edit Mode Toggle */}
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-colors focus:outline-none ${
                isEditMode
                  ? "border border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => {
                setIsEditMode(!isEditMode);
              }}
            >
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="16"
              >
                <path
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              {isEditMode ? "Select Row to Edit" : "Edit Mode"}
            </button>

            {/* SORT DROPDOWN CONTAINER */}
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none"
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                }}
              >
                <svg
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <path
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Sort & Filter
              </button>

              {/* DROPDOWN MENU */}
              {isFilterOpen && (
                <div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-xl">
                  <div className="px-4 py-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Sort By Column
                  </div>
                  <SortMenuItem
                    columnId="roleName"
                    label="Role Name (A-Z)"
                    table={table}
                  />
                  <SortMenuItem
                    columnId="roleInsertDate"
                    label="Date Added"
                    table={table}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MAIN DATA CARD */}
        <div
          className={`mx-auto w-full max-w-6xl overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${isEditMode ? "border-yellow-400 ring-4 ring-yellow-400/20" : "border-gray-200"}`}
        >
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] table-auto text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className="px-6 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase"
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
              <tbody className="divide-y divide-gray-100 bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    className={`transition-colors ${
                      isEditMode
                        ? "cursor-pointer hover:bg-yellow-50"
                        : "hover:bg-gray-50"
                    }`}
                    key={row.id}
                    onClick={() => {
                      handleRowClick(row.original.roleId);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className="px-6 py-4 align-middle whitespace-nowrap text-gray-700"
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

                {/* Empty State Fallback */}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td
                      className="px-6 py-12 text-center text-gray-500"
                      colSpan={columns.length}
                    >
                      No roles found. Click "Add Role" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row">
            <div className="mb-4 flex items-center gap-2 sm:mb-0">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                className="cursor-pointer rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                value={table.getState().pagination.pageSize}
              >
                {[5, 10, 15, 20].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Page{" "}
                <span className="font-semibold text-gray-900">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {table.getPageCount() || 1}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => {
                    table.previousPage();
                  }}
                >
                  Previous
                </button>
                <button
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!table.getCanNextPage()}
                  onClick={() => {
                    table.nextPage();
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Separate component for the sorting dropdown items
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
      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
      onClick={() => column?.toggleSorting()}
    >
      <span>{label}</span>
      <span className="w-4 text-center font-bold">
        {isSorted === "asc" ? "↑" : isSorted === "desc" ? "↓" : ""}
      </span>
    </button>
  );
}
