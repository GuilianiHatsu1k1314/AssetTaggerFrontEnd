import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { ProtectedRoute } from "./components/-ProtectedRoute";
import { Sidebar } from "./components/-SideBar";
import { useDatabase } from "./context/-AssetContext";

// 1. Require tableName in the search params
export const Route = createFileRoute("/AddValue")({
  component: AddValuePage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tableName: (search.tableName as string) || "Asset",
    };
  },
});

// ============================================================================
// CUSTOM COMPONENT: Searchable Dropdown
// ============================================================================
function SearchableSelect({
  onChange,
  options,
  placeholder,
  value,
}: {
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  value: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Find the selected option to display its label
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative w-full min-w-[200px]" ref={wrapperRef}>
      <div
        className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <div className="sticky top-0 bg-white px-2 pt-1 pb-2">
            <input
              autoFocus
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Search..."
              type="text"
              value={searchTerm}
            />
          </div>
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No matches found.
            </div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                className={`cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${value === opt.value ? "bg-blue-50 font-bold text-blue-700" : "text-gray-700"}`}
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setSearchTerm(""); // Reset search on select
                }}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CENTRALIZED SCHEMA CONFIGURATIONS
// ============================================================================

// Helper for the 64+ boolean permission dropdowns
const permOptions = [
  { label: "Granted", value: "true" },
  { label: "Denied", value: "false" },
];

const tableConfigs: Record<string, any[]> = {
  Asset: [
    { isReadOnly: true, key: "AssetID", label: "Asset ID" },
    { isReadOnly: true, key: "AssetTagDate", label: "Tag Date (Auto)" },
    { key: "AssetPurchaseDate", label: "Purchase Date", type: "date" },
    { key: "AssetPurchasePrice", label: "Purchase Price", type: "number" },
    { key: "AssetSerialNumber", label: "Serial Number", type: "text" },
    {
      key: "AssetWarrantyUnitOfMeasure",
      label: "Warranty Unit",
      options: [
        { label: "mm (Month)", value: "mm" },
        { label: "yy (Year)", value: "yy" },
      ],
    },
    { key: "AssetWarrantyDuration", label: "Warranty Duration", type: "number" },
    { key: "AssetUsefulLife", label: "Useful Life (Yrs)", type: "number" },
    { key: "AssetSalvageValue", label: "Salvage Value", type: "number" },
    { key: "EmployeeID", label: "Employee", relationLabel: "employeeFullName", relationTable: "Employee", relationValue: "employeeId", type: "relation" },
    { key: "LocationID", label: "Location", relationLabel: "locationAddress", relationTable: "Location", relationValue: "locationId", type: "relation" },
    { key: "ProductID", label: "Product", relationLabel: "productName", relationTable: "Product", relationValue: "productId", type: "relation" },
    { key: "VendorID", label: "Vendor", relationLabel: "vendorName", relationTable: "Vendor", relationValue: "vendorId", type: "relation" },
  ],
  AssetFix: [
    { isReadOnly: true, key: "assetFixId", label: "Fix ID" },
    { key: "assetIssueId", label: "Issue", relationLabel: "assetIssueTitle", relationTable: "AssetIssue", relationValue: "assetIssueId", type: "relation" },
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
    { key: "employeeId", label: "Fixed By", relationLabel: "employeeFullName", relationTable: "Employee", relationValue: "employeeId", type: "relation" },
  ],
  AssetIssue: [
    { isReadOnly: true, key: "assetIssueId", label: "Issue ID" },
    { key: "assetIssueTitle", label: "Title", type: "text" },
    { key: "assetIssueDescription", label: "Description", type: "text" },
    { key: "assetIssueDate", label: "Issue Date", type: "date" },
    { key: "assetId", label: "Asset", relationLabel: "assetSerialNumber", relationTable: "Asset", relationValue: "assetId", type: "relation" },
    { key: "employeeId", label: "Reported By", relationLabel: "employeeFullName", relationTable: "Employee", relationValue: "employeeId", type: "relation" },
  ],
  AssetTransfer: [
    { isReadOnly: true, key: "assetTransferId", label: "Transfer ID" },
    { key: "assetTransferDate", label: "Transfer Date", type: "date" },
    { key: "assetTransferPrice", label: "Transfer Price", type: "number" },
    { key: "assetId", label: "Asset", relationLabel: "assetSerialNumber", relationTable: "Asset", relationValue: "assetId", type: "relation" },
    { key: "companyId", label: "Origin Company", relationLabel: "companyName", relationTable: "Company", relationValue: "companyId", type: "relation" },
    { key: "receivingCompanyId", label: "Receiving Company", relationLabel: "companyName", relationTable: "Company", relationValue: "companyId", type: "relation" },
  ],
  Building: [
    { isReadOnly: true, key: "buildingId", label: "Building ID" },
    { key: "buildingName", label: "Building Name", type: "text" },
    { key: "companyId", label: "Company", relationLabel: "companyName", relationTable: "Company", relationValue: "companyId", type: "relation" },
    { key: "buildingAddress", label: "Address", type: "text" },
  ],
  Category: [
    { isReadOnly: true, key: "categoryId", label: "Category ID" },
    { key: "categoryName", label: "Category Name", type: "text" },
  ],
  Company: [
    { isReadOnly: true, key: "companyId", label: "Company ID" },
    { key: "companyCode", label: "Company Code", type: "text" },
    { key: "companyName", label: "Company Name", type: "text" },
    { key: "parentCompanyId", label: "Parent Company", relationLabel: "companyName", relationTable: "Company", relationValue: "companyId", type: "relation" },
    { key: "companyAddress", label: "Address", type: "text" },
  ],
  Department: [
    { isReadOnly: true, key: "departmentId", label: "Department ID" },
    { key: "departmentName", label: "Department Name", type: "text" },
  ],
  Employee: [
    { isReadOnly: true, key: "employeeId", label: "Employee ID" },
    { key: "employeeFullName", label: "Full Name", type: "text" },
    { key: "roleId", label: "Role", relationLabel: "roleName", relationTable: "Role", relationValue: "roleId", type: "relation" },
    { key: "companyId", label: "Company", relationLabel: "companyName", relationTable: "Company", relationValue: "companyId", type: "relation" },
    { key: "departmentId", label: "Department", relationLabel: "departmentName", relationTable: "Department", relationValue: "departmentId", type: "relation" },
  ],
  EndUser: [
    { isReadOnly: true, key: "endUserId", label: "User ID" },
    { key: "endUserName", label: "Username", type: "text" },
    { key: "endUserRoleId", label: "Role", relationLabel: "roleName", relationTable: "Role", relationValue: "roleId", type: "relation" },
    { key: "employeeId", label: "Employee", relationLabel: "employeeFullName", relationTable: "Employee", relationValue: "employeeId", type: "relation" },
  ],
  
  // ==========================================
  // NEW: EndUserRole 
  // ==========================================
  EndUserRole: [
    { isReadOnly: true, key: "EndUserRoleID", label: "Role ID" },
    { key: "EndUserRoleName", label: "Role Name", type: "text" },
    
    // --- CREATE PERMISSIONS ---
    { key: "CreateAsset", label: "Create Asset", options: permOptions },
    { key: "CreateAssetFix", label: "Create Asset Fix", options: permOptions },
    { key: "CreateAssetIssue", label: "Create Asset Issue", options: permOptions },
    { key: "CreateBuilding", label: "Create Building", options: permOptions },
    { key: "CreateCategory", label: "Create Category", options: permOptions },
    { key: "CreateCompany", label: "Create Company", options: permOptions },
    { key: "CreateDepartment", label: "Create Department", options: permOptions },
    { key: "CreateEmployee", label: "Create Employee", options: permOptions },
    { key: "CreateEndUser", label: "Create End User", options: permOptions },
    { key: "CreateEndUserRole", label: "Create Role", options: permOptions },
    { key: "CreateLocation", label: "Create Location", options: permOptions },
    { key: "CreateManufacturer", label: "Create Manufacturer", options: permOptions },
    { key: "CreateProduct", label: "Create Product", options: permOptions },
    { key: "CreateProductSet", label: "Create Product Set", options: permOptions },
    { key: "CreateRole", label: "Create Legacy Role", options: permOptions },
    { key: "CreateVendor", label: "Create Vendor", options: permOptions },

    // --- READ PERMISSIONS ---
    { key: "ReadAsset", label: "Read Asset", options: permOptions },
    { key: "ReadAssetFix", label: "Read Asset Fix", options: permOptions },
    { key: "ReadAssetIssue", label: "Read Asset Issue", options: permOptions },
    { key: "ReadBuilding", label: "Read Building", options: permOptions },
    { key: "ReadCategory", label: "Read Category", options: permOptions },
    { key: "ReadCompany", label: "Read Company", options: permOptions },
    { key: "ReadDepartment", label: "Read Department", options: permOptions },
    { key: "ReadEmployee", label: "Read Employee", options: permOptions },
    { key: "ReadEndUser", label: "Read End User", options: permOptions },
    { key: "ReadEndUserRole", label: "Read Role", options: permOptions },
    { key: "ReadLocation", label: "Read Location", options: permOptions },
    { key: "ReadLog", label: "Read System Logs", options: permOptions },
    { key: "ReadManufacturer", label: "Read Manufacturer", options: permOptions },
    { key: "ReadProduct", label: "Read Product", options: permOptions },
    { key: "ReadProductSet", label: "Read Product Set", options: permOptions },
    { key: "ReadRole", label: "Read Legacy Role", options: permOptions },
    { key: "ReadVendor", label: "Read Vendor", options: permOptions },

    // --- UPDATE PERMISSIONS ---
    { key: "UpdateAsset", label: "Update Asset", options: permOptions },
    { key: "UpdateAssetFix", label: "Update Asset Fix", options: permOptions },
    { key: "UpdateAssetIssue", label: "Update Asset Issue", options: permOptions },
    { key: "UpdateBuilding", label: "Update Building", options: permOptions },
    { key: "UpdateCategory", label: "Update Category", options: permOptions },
    { key: "UpdateCompany", label: "Update Company", options: permOptions },
    { key: "UpdateDepartment", label: "Update Department", options: permOptions },
    { key: "UpdateEmployee", label: "Update Employee", options: permOptions },
    { key: "UpdateEndUser", label: "Update End User", options: permOptions },
    { key: "UpdateEndUserRole", label: "Update Role", options: permOptions },
    { key: "UpdateLocation", label: "Update Location", options: permOptions },
    { key: "UpdateManufacturer", label: "Update Manufacturer", options: permOptions },
    { key: "UpdateProduct", label: "Update Product", options: permOptions },
    { key: "UpdateProductSet", label: "Update Product Set", options: permOptions },
    { key: "UpdateRole", label: "Update Legacy Role", options: permOptions },
    { key: "UpdateVendor", label: "Update Vendor", options: permOptions },

    // --- DELETE PERMISSIONS ---
    { key: "DeleteAsset", label: "Delete Asset", options: permOptions },
    { key: "DeleteAssetFix", label: "Delete Asset Fix", options: permOptions },
    { key: "DeleteAssetIssue", label: "Delete Asset Issue", options: permOptions },
    { key: "DeleteBuilding", label: "Delete Building", options: permOptions },
    { key: "DeleteCategory", label: "Delete Category", options: permOptions },
    { key: "DeleteCompany", label: "Delete Company", options: permOptions },
    { key: "DeleteDepartment", label: "Delete Department", options: permOptions },
    { key: "DeleteEmployee", label: "Delete Employee", options: permOptions },
    { key: "DeleteEndUser", label: "Delete End User", options: permOptions },
    { key: "DeleteEndUserRole", label: "Delete Role", options: permOptions },
    { key: "DeleteLocation", label: "Delete Location", options: permOptions },
    { key: "DeleteLog", label: "Delete System Logs", options: permOptions },
    { key: "DeleteManufacturer", label: "Delete Manufacturer", options: permOptions },
    { key: "DeleteProduct", label: "Delete Product", options: permOptions },
    { key: "DeleteProductSet", label: "Delete Product Set", options: permOptions },
    { key: "DeleteRole", label: "Delete Legacy Role", options: permOptions },
    { key: "DeleteVendor", label: "Delete Vendor", options: permOptions },
  ],

  Location: [
    { isReadOnly: true, key: "locationId", label: "Location ID" },
    { key: "locationAddress", label: "Address / Room", type: "text" },
    { key: "buildingId", label: "Building", relationLabel: "buildingName", relationTable: "Building", relationValue: "buildingId", type: "relation" },
  ],
  Manufacturer: [
    { isReadOnly: true, key: "manufacturerId", label: "Manufacturer ID" },
    { key: "manufacturerName", label: "Manufacturer Name", type: "text" },
  ],
  Product: [
    { isReadOnly: true, key: "productId", label: "Product ID" },
    { key: "productName", label: "Product Name", type: "text" },
    { key: "productModelNumber", label: "Model Number", type: "text" },
    { key: "manufacturerId", label: "Manufacturer", relationLabel: "manufacturerName", relationTable: "Manufacturer", relationValue: "manufacturerId", type: "relation" },
    { key: "categoryId", label: "Category", relationLabel: "categoryName", relationTable: "Category", relationValue: "categoryId", type: "relation" },
  ],
  ProductSet: [
    { key: "parentProductId", label: "Parent Product", relationLabel: "productName", relationTable: "Product", relationValue: "productId", type: "relation" },
    { key: "productId", label: "Child Product", relationLabel: "productName", relationTable: "Product", relationValue: "productId", type: "relation" },
  ],
  Role: [
    { isReadOnly: true, key: "roleId", label: "Role ID" },
    { key: "roleName", label: "Role Name", type: "text" },
  ],
  Vendor: [
    { isReadOnly: true, key: "vendorId", label: "Vendor ID" },
    { key: "vendorName", label: "Vendor Name", type: "text" },
    { key: "vendorAddress", label: "Address", type: "text" },
  ],
};

function AddValuePage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/AddValue" });
  const { addRecord, getTableData } = useDatabase();

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, getBlankRow()]);
  };

  // ==========================================
  // Handle Removing a Row
  // ==========================================
  const handleRemoveRow = (indexToRemove: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleSubmit = async () => {
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

    setIsSubmitting(true);

    try {
      // Process and Save Data Concurrently
      await Promise.all(
        rows.map(async (row) => {
          const formattedRow: Record<string, any> = { ...row };

          currentTableConfig.forEach((col) => {
            // 1. DELETE AUTO-GENERATED/OMITTED IDs
            if (col.isReadOnly) {
              delete formattedRow[col.key];
            }
            // 2. Format Dates for Zod/SQL (ISO 8601)
            else if (col.type === "date") {
              if (row[col.key]) {
                formattedRow[col.key] = new Date(row[col.key]).toISOString();
              } else {
                formattedRow[col.key] = null;
              }
            }
            // 3. Format Numbers
            else if (col.type === "number") {
              formattedRow[col.key] = Number(row[col.key]) || 0;
            }
            // 4. Format Booleans
            else if (col.key === "assetFixed") {
              formattedRow[col.key] = row[col.key] === "true";
            }
          });

          // Insert into the global database context (API Call)
          await addRecord(search.tableName, formattedRow);
        }),
      );

      alert(`Successfully added ${rows.length} new ${search.tableName}(s)!`);
      navigate({ to: `/table/${search.tableName}` });
    } catch (error) {
      alert("An error occurred while saving. Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
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
              type="button"
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
          <div className="w-full max-w-[1400px] overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto overflow-y-visible pb-32">
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
                    <th className="w-16 px-4 py-4 text-center align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Action
                    </th>
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
                            <td
                              className="px-4 py-3 align-middle"
                              key={col.key}
                            >
                              <div className="flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400">
                                (Auto)
                              </div>
                            </td>
                          );
                        }

                        // 2. SEARCHABLE RELATION DROPDOWNS
                        if (col.type === "relation") {
                          const relationData = getTableData(col.relationTable);

                          const mappedOptions = relationData.map((item) => ({
                            label: item[col.relationLabel] || "Unnamed Record",
                            value: item[col.relationValue],
                          }));

                          return (
                            <td
                              className="px-4 py-3 align-middle"
                              key={col.key}
                            >
                              <SearchableSelect
                                onChange={(val) => {
                                  handleChange(index, col.key, val);
                                }}
                                options={mappedOptions}
                                placeholder={`Select ${col.label}...`}
                                value={row[col.key]}
                              />
                            </td>
                          );
                        }

                        // 3. STANDARD DROPDOWN FIELDS
                        if (col.options) {
                          return (
                            <td
                              className="px-4 py-3 align-middle"
                              key={col.key}
                            >
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

                        // 4. DATE AND NUMBER FIELDS
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

                      {/* Trash Can Delete Button */}
                      <td className="w-16 px-4 py-3 text-center align-middle">
                        {rows.length > 1 && (
                          <button
                            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
                            disabled={isSubmitting}
                            onClick={() => {
                              handleRemoveRow(index);
                            }}
                            title="Remove Row"
                            type="button"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Row Button */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <button
                className="group flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-500 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none disabled:opacity-50"
                disabled={isSubmitting}
                onClick={handleAddRow}
                type="button"
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
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
              onClick={handleSubmit}
              type="button"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
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
                </span>
              )}
            </button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
