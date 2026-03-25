import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ProtectedRoute } from "../components/-ProtectedRoute";
import { Sidebar } from "../components/-SideBar";
import { useDatabase } from "../context/-AssetContext";

export const Route = createFileRoute("/adminpages/ManageUserRoles")({
  component: CreateRolePage,
});

// The 17 core modules in your database schema
const SYSTEM_MODULES = [
  "Asset",
  "AssetFix",
  "AssetIssue",
  "Building",
  "Category",
  "Company",
  "Department",
  "Employee",
  "EndUser",
  "EndUserRole",
  "Location",
  "Log",
  "Manufacturer",
  "Product",
  "ProductSet",
  "Role",
  "Vendor",
];

function CreateRolePage() {
  const navigate = useNavigate();
  const { addRecord } = useDatabase();

  const [roleName, setRoleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize all 64 possible permissions to false (unchecked)
  const [permissions, setPermissions] = useState<Record<string, boolean>>(
    () => {
      const initialPerms: Record<string, boolean> = {};
      SYSTEM_MODULES.forEach((mod) => {
        initialPerms[`Read${mod}`] = false;
        initialPerms[`Delete${mod}`] = false;

        // Log module does not have Create/Update in your schema
        if (mod !== "Log") {
          initialPerms[`Create${mod}`] = false;
          initialPerms[`Update${mod}`] = false;
        }
      });
      return initialPerms;
    },
  );

  const handleToggle = (permKey: string) => {
    setPermissions((prev) => ({
      ...prev,
      [permKey]: !prev[permKey],
    }));
  };

  const handleBulkSelect = (value: boolean) => {
    setPermissions((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = value;
      });
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      alert("Please enter a Role Name.");
      return;
    }

    setIsSubmitting(true);

    try {
      // CRITICAL: Convert React boolean (true/false) to SQL BIT (1/0)
      const formattedPermissions: Record<string, 0 | 1> = {};
      Object.keys(permissions).forEach((key) => {
        formattedPermissions[key] = permissions[key] ? 1 : 0;
      });

      // Bundle the role name and the 64 formatted bit flags
      const payload = {
        EndUserRoleName: roleName,
        ...formattedPermissions,
      };

      // Send to the Express API
      await addRecord("EndUserRole", payload);

      alert(`Successfully created security role: ${roleName}`);
      navigate({ to: "/adminpages/CreateRole" });
    } catch (error) {
      alert(
        "An error occurred while creating the role. Please check the console.",
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin={false}>
      <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 md:text-base">
            <Link
              className="hover:text-blue-600 hover:underline"
              to="/adminpages/AdminPage"
            >
              Admin Dashboard
            </Link>
            <span>/</span>
            <Link
              className="hover:text-blue-600 hover:underline"
              to="/table/EndUserRole"
            >
              Roles Display
            </Link>
            <span>/</span>
            <span className="text-gray-900">Create Role</span>
          </div>

          <div className="mb-8 flex items-center gap-4">
            <button
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onClick={() => {
                window.history.back();
              }}
              type="button"
            >
              <svg
                fill="none"
                height="28"
                stroke="black"
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
              <h1 className="text-2xl font-bold text-black md:text-3xl">
                Create New Role
              </h1>
              <p className="text-sm text-gray-500 md:text-base">
                Assign a name and toggle the specific module permissions for
                this role.
              </p>
            </div>
          </div>

          <form className="mx-auto max-w-6xl" onSubmit={handleSubmit}>
            {/* Top Config Card */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex-1">
                  <label
                    className="mb-2 block text-sm font-semibold text-gray-700"
                    htmlFor="roleName"
                  >
                    Role Name
                  </label>
                  <input
                    className="w-full max-w-md rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    id="roleName"
                    onChange={(e) => {
                      setRoleName(e.target.value);
                    }}
                    placeholder="e.g. Senior Auditor, Helpdesk L1..."
                    required
                    type="text"
                    value={roleName}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onClick={() => {
                      handleBulkSelect(true);
                    }}
                    type="button"
                  >
                    Enable All
                  </button>
                  <button
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onClick={() => {
                      handleBulkSelect(false);
                    }}
                    type="button"
                  >
                    Disable All
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {SYSTEM_MODULES.map((mod) => (
                <div
                  className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  key={mod}
                >
                  <h3 className="mb-4 border-b border-gray-100 pb-2 text-lg font-bold text-gray-900">
                    {mod}
                  </h3>
                  <div className="flex flex-col gap-1">
                    <ToggleCheck
                      checked={permissions[`Read${mod}`] || false}
                      label={`Read ${mod}`}
                      onChange={() => {
                        handleToggle(`Read${mod}`);
                      }}
                    />

                    {/* Exclude Create/Update for Log tables if needed */}
                    {mod !== "Log" && (
                      <>
                        <ToggleCheck
                          checked={permissions[`Create${mod}`] || false}
                          label={`Create ${mod}`}
                          onChange={() => {
                            handleToggle(`Create${mod}`);
                          }}
                        />
                        <ToggleCheck
                          checked={permissions[`Update${mod}`] || false}
                          label={`Update ${mod}`}
                          onChange={() => {
                            handleToggle(`Update${mod}`);
                          }}
                        />
                      </>
                    )}

                    <ToggleCheck
                      checked={permissions[`Delete${mod}`] || false}
                      label={`Delete ${mod}`}
                      onChange={() => {
                        handleToggle(`Delete${mod}`);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 mt-8 flex justify-end gap-4 border-t border-gray-200 bg-gray-50/90 py-4 backdrop-blur-sm">
              <button
                className="rounded-full border-2 border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none disabled:opacity-50"
                disabled={isSubmitting}
                onClick={() => {
                  window.history.back();
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-full bg-[#1d4ed8] px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:opacity-50"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
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
                    Saving Role...
                  </>
                ) : (
                  "Save Security Role"
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Reusable animated toggle component
function ToggleCheck({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
        {/* Hidden native checkbox for accessibility */}
        <input
          checked={checked}
          className="sr-only"
          onChange={onChange}
          type="checkbox"
        />
      </div>
    </label>
  );
}
