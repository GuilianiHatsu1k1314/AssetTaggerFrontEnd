import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Sidebar } from "./components/-SideBar";
import { useDatabase } from "./context/-AssetContext";

// 1. Updated Search Params to require BOTH tableName and the ID
export const Route = createFileRoute("/EditValue")({
  component: EditValuePage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: (search.id as string) || (search.assetId as string), // Fallback for old links
      tableName: (search.tableName as string) || "Asset",
    };
  },
});

// ============================================================================
// HELPER FUNCTIONS (Must be outside the component)
// ============================================================================
const formatForDatePicker = (dateStr: string) => {
  if (!dateStr?.includes("/")) return dateStr;
  const [month, day, year] = dateStr.split("/");
  const paddedMonth = month.padStart(2, "0");
  const paddedDay = day.padStart(2, "0");
  return `${year}-${paddedMonth}-${paddedDay}`;
};

const formatToUSDate = (dateStr: string) => {
  if (!dateStr?.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(month)}/${parseInt(day)}/${year}`;
};

// ============================================================================
// CENTRALIZED SCHEMA CONFIGURATIONS (Must be outside the component)
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
  Category: [
    { isReadOnly: true, key: "categoryId", label: "Category ID" },
    { key: "categoryName", label: "Category Name", type: "text" },
    { key: "categoryInsertDate", label: "Date Added", type: "date" },
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
  Employee: [
    { isReadOnly: true, key: "employeeId", label: "Employee ID" },
    { key: "employeeFullName", label: "Full Name", type: "text" },
    { key: "roleId", label: "Role ID", type: "text" },
    { key: "companyId", label: "Company ID", type: "text" },
    { key: "departmentId", label: "Department ID", type: "text" },
    { key: "employeeInsertDate", label: "Date Added", type: "date" },
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
// ============================================================================
// MAIN COMPONENT
// ============================================================================
function EditValuePage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/EditValue" });

  const currentTableConfig =
    tableConfigs[search.tableName] || tableConfigs.Asset;

  // Pulling 'db' directly ensures we always have the latest reference
  const { db, updateRecord } = useDatabase();

  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    // 1. Get the entire table array directly from db
    const tableData = db[search.tableName] || [];

    // 2. Identify the primary key column from our config (usually the first item)
    const primaryKeyId = currentTableConfig[0].key;

    // 3. Find the specific row to edit (Using String().trim() to make it bulletproof against typos)
    const selectedRecord = tableData.find(
      (row) => String(row[primaryKeyId]).trim() === String(search.id).trim(),
    );

    if (selectedRecord) {
      const initialData: Record<string, any> = {};

      currentTableConfig.forEach((col) => {
        if (col.type === "date") {
          initialData[col.key] = formatForDatePicker(
            selectedRecord[col.key] || "",
          );
        } else {
          initialData[col.key] = selectedRecord[col.key] || "";
        }
      });

      setFormData(initialData);
    } else {
      console.warn(
        `🚨 WARNING: Could not find ID '${search.id}' in the '${search.tableName}' table. Make sure your local storage is cleared and your table is using getTableData()!`,
      );
    }
  }, [search.id, search.tableName, db, currentTableConfig]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const formattedData = { ...formData };

    currentTableConfig.forEach((col) => {
      if (col.type === "date") {
        formattedData[col.key] = formatToUSDate(formattedData[col.key]);
      }
      if (col.type === "number") {
        formattedData[col.key] = Number(formattedData[col.key]);
      }
      // For the boolean select box on AssetFix
      if (col.key === "assetFixed") {
        formattedData[col.key] = formattedData[col.key] === "true";
      }
    });

    const primaryKeyId = currentTableConfig[0].key;

    // Dynamically update the correct table using the context
    updateRecord(search.tableName, primaryKeyId, search.id, formattedData);

    alert(`${search.tableName} updated successfully!`);
    navigate({ to: `/table/${search.tableName}` });
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
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
          <span className="text-gray-900">Edit {search.tableName}</span>
        </div>

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
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Edit {search.tableName}
            </h1>
            <p className="mt-1 text-sm text-gray-500 md:text-base">
              Update the details for ID:{" "}
              <span className="font-semibold text-blue-600">{search.id}</span>
            </p>
          </div>
        </div>

        <div className="w-full max-w-[1400px]">
          <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] table-auto text-left text-sm">
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

                <tbody className="bg-white">
                  <tr className="hover:bg-gray-50">
                    {currentTableConfig.map((col) => {
                      if (col.isReadOnly) {
                        return (
                          <td className="px-4 py-4 align-middle" key={col.key}>
                            <div className="flex w-full min-w-[100px] items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700">
                              {search.id}
                            </div>
                          </td>
                        );
                      }

                      if (col.options) {
                        return (
                          <td className="px-4 py-4 align-middle" key={col.key}>
                            <select
                              className="w-full min-w-[140px] cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                              name={col.key}
                              onChange={handleChange}
                              value={String(formData[col.key] || "")}
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

                      return (
                        <td className="px-4 py-4 align-middle" key={col.key}>
                          <input
                            className="w-full min-w-[140px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            name={col.key}
                            onChange={handleChange}
                            placeholder={`Enter ${col.label}...`}
                            type={col.type || "text"}
                            value={formData[col.key] || ""}
                          />
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              onClick={handleSave}
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
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
