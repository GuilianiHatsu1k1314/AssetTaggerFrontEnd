import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState } from "react";

import { Sidebar } from "./components/-SideBar";
import { useDatabase } from "./context/-AssetContext"; // Updated Context

// 1. Require tableName in the search params
export const Route = createFileRoute("/AddValue")({
  component: AddValuePage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tableName: (search.tableName as string) || "Asset", // Default to Asset if missing
    };
  },
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const formatToUSDate = (dateStr: string) => {
  if (!dateStr?.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(month)}/${parseInt(day)}/${year}`;
};

// ============================================================================
// CENTRALIZED SCHEMA CONFIGURATIONS (Matches EditValue.tsx)
// ============================================================================
const tableConfigs: Record<string, any[]> = {
  Asset: [
    { isReadOnly: true, key: "assetId", label: "Asset ID" },
    { key: "assetTagDate", label: "Tag Date", type: "date" },
    { key: "purchaseDate", label: "Purchase Date", type: "date" },
    { key: "purchasePrice", label: "Purchase Price", type: "text" },
    { key: "serialNumber", label: "Serial Number", type: "text" },
    {
      key: "warrantyUnit",
      label: "Warranty Unit",
      options: [
        { label: "mm (Month)", value: "mm" },
        { label: "yy (Year)", value: "yy" },
      ],
    },
    { key: "warrantyDuration", label: "Warranty Duration", type: "number" },
  ],
  AssetFix: [
    { isReadOnly: true, key: "assetFixId", label: "Fix ID" },
    { key: "assetIssueId", label: "Issue ID", type: "text" },
    { key: "assetFixDateStart", label: "Date Start", type: "date" },
    { key: "assetFixDateEnd", label: "Date End", type: "date" },
    { key: "assetFixCost", label: "Cost", type: "number" },
    { key: "assetFixTitle", label: "Title", type: "text" },
    { key: "assetFixDescription", label: "Description", type: "text" },
    {
      key: "assetFixed",
      label: "Status",
      options: [
        { label: "Fixed", value: "true" },
        { label: "Pending", value: "false" },
      ],
    },
    { key: "employeeId", label: "Employee ID", type: "text" },
  ],
  AssetIssue: [
    { isReadOnly: true, key: "assetIssueId", label: "Issue ID" },
    { key: "assetIssueTitle", label: "Title", type: "text" },
    { key: "assetIssueDescription", label: "Description", type: "text" },
    { key: "assetIssueDate", label: "Issue Date", type: "date" },
    { key: "assetId", label: "Asset ID (Target)", type: "text" },
    { key: "employeeId", label: "Reported By (Emp ID)", type: "text" },
  ],
  AssetTransfer: [
    { isReadOnly: true, key: "assetTransferId", label: "Transfer ID" },
    { key: "assetTransferDate", label: "Transfer Date", type: "date" },
    { key: "assetTransferPrice", label: "Transfer Price", type: "text" },
    { key: "assetId", label: "Asset ID", type: "text" },
    { key: "companyId", label: "Origin Company ID", type: "text" },
    { key: "receivingCompanyId", label: "Receiving Company ID", type: "text" },
  ],
  Building: [
    { isReadOnly: true, key: "buildingId", label: "Building ID" },
    { key: "buildingName", label: "Building Name", type: "text" },
    { key: "companyId", label: "Company ID", type: "text" },
    { key: "buildingAddress", label: "Address", type: "text" },
    { key: "buildingInsertDate", label: "Date Added", type: "date" },
  ],
  Company: [
    { isReadOnly: true, key: "companyId", label: "Company ID" },
    { key: "companyCode", label: "Company Code", type: "text" },
    { key: "companyName", label: "Company Name", type: "text" },
    { key: "parentCompanyId", label: "Parent Company ID", type: "text" },
    { key: "companyAddress", label: "Address", type: "text" },
  ],
  Department: [
    { isReadOnly: true, key: "departmentId", label: "Department ID" },
    { key: "departmentName", label: "Department Name", type: "text" },
    { key: "departmentInsertDate", label: "Date Added", type: "date" },
  ],
  EndUser: [
    { isReadOnly: true, key: "endUserId", label: "User ID" },
    { key: "endUserName", label: "Username", type: "text" },
    { key: "endUserRoleId", label: "Role ID", type: "text" },
    { key: "employeeId", label: "Employee ID", type: "text" },
    { key: "endUserRegisterDate", label: "Registration Date", type: "date" },
  ],
  Location: [
    { isReadOnly: true, key: "locationId", label: "Location ID" },
    { key: "locationAddress", label: "Address / Room", type: "text" },
    { key: "buildingId", label: "Building ID", type: "text" },
    { key: "locationInsertDate", label: "Date Added", type: "date" },
  ],
  Manufacturer: [
    { isReadOnly: true, key: "manufacturerId", label: "Manufacturer ID" },
    { key: "manufacturerName", label: "Manufacturer Name", type: "text" },
    { key: "manufacturerInsertDate", label: "Date Added", type: "date" },
  ],
  Product: [
    { isReadOnly: true, key: "productId", label: "Product ID" },
    { key: "productName", label: "Product Name", type: "text" },
    { key: "productModelNumber", label: "Model Number", type: "text" },
    { key: "manufacturerId", label: "Manufacturer ID", type: "text" },
    { key: "categoryId", label: "Category ID", type: "text" },
    { key: "productInsertDate", label: "Date Added", type: "date" },
  ],
  ProductSet: [
    { isReadOnly: true, key: "parentProductId", label: "Parent Product ID" },
    { isReadOnly: true, key: "productId", label: "Child Product ID" },
    { key: "productSetInsertDate", label: "Date Added", type: "date" },
  ],
  Role: [
    { isReadOnly: true, key: "roleId", label: "Role ID" },
    { key: "roleName", label: "Role Name", type: "text" },
    { key: "roleInsertDate", label: "Date Added", type: "date" },
  ],
  Vendor: [
    { isReadOnly: true, key: "vendorId", label: "Vendor ID" },
    { key: "vendorName", label: "Vendor Name", type: "text" },
    { key: "vendorAddress", label: "Address", type: "text" },
    { key: "vendorInsertDate", label: "Date Added", type: "date" },
  ],
};

function AddValuePage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/AddValue" });
  const { addRecord } = useDatabase();

  // Determine which configuration to use based on the URL
  const currentTableConfig =
    tableConfigs[search.tableName] || tableConfigs.Asset;

  const getBlankRow = () => {
    const blankRow: Record<string, string> = {};
    currentTableConfig.forEach((col) => {
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

    // Simple Validation: Ensure non-readonly fields aren't completely empty
    for (const row of rows) {
      for (const col of currentTableConfig) {
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

    // Process and Save Data
    rows.forEach((row) => {
      const formattedRow: Record<string, any> = { ...row };

      currentTableConfig.forEach((col) => {
        // 1. Generate Fake ID for the primary key column (usually the read-only one)
        if (col.isReadOnly) {
          formattedRow[col.key] = `NEW-${Math.floor(Math.random() * 10000)}`;
        }
        // 2. Format Dates
        else if (col.type === "date") {
          formattedRow[col.key] = formatToUSDate(String(row[col.key]));
        }
        // 3. Format Numbers
        else if (col.type === "number") {
          formattedRow[col.key] = Number(row[col.key]) || 0;
        }
        // 4. Format Booleans (for AssetFix)
        else if (col.key === "assetFixed") {
          formattedRow[col.key] = row[col.key] === "true";
        }
      });

      // Insert into the global database context!
      addRecord(search.tableName, formattedRow);
    });

    alert(`Successfully added ${rows.length} new ${search.tableName}(s)!`);
    navigate({ to: `/table/${search.tableName}` });
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
            to={`/table/${search.tableName}`}
          >
            {search.tableName} Display
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
              Add New {search.tableName}s
            </h1>
            <p className="mt-1 text-sm text-gray-500 md:text-base">
              Fill out the rows below to register new{" "}
              {search.tableName.toLowerCase()}s into the system.
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
                  {currentTableConfig.map((col) => (
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
                    {currentTableConfig.map((col) => {
                      // 1. READ ONLY FIELDS (Auto-Generated IDs)
                      if (col.isReadOnly) {
                        return (
                          <td className="px-4 py-3 align-middle" key={col.key}>
                            <div className="flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400">
                              (Auto)
                            </div>
                          </td>
                        );
                      }

                      // 2. DROPDOWN FIELDS
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
                              {col.options.map((opt: any) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      }

                      // 3. DATE AND NUMBER FIELDS
                      return (
                        <td className="px-4 py-3 align-middle" key={col.key}>
                          <input
                            className="w-full min-w-[140px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            onChange={(e) => {
                              handleChange(index, col.key, e.target.value);
                            }}
                            placeholder={`Enter ${col.label}...`}
                            type={col.type || "text"}
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

          {/* Add Row Button */}
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
            Save {search.tableName}s
          </button>
        </div>
      </main>
    </div>
  );
}
