import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { ProtectedRoute } from "../components/-ProtectedRoute";
import { Sidebar } from "../components/-SideBar";
import { useDatabase } from "../context/-AssetContext";

export const Route = createFileRoute("/adminpages/RegisterUser")({
  component: RegisterUserPage,
});

// ============================================================================
// MAIN PAGE
// ============================================================================
function RegisterUserPage() {
  const navigate = useNavigate();

  // Connect to the universal context!
  const { addRecord, getTableData } = useDatabase();

  // Pull live relational data for the dropdowns
  const employees = getTableData("Employee");
  // CHANGED: Now pulling from the granular EndUserRole table!
  const roles = getTableData("EndUserRole");

  const [formData, setFormData] = useState({
    employeeId: "",
    endUserName: "",
    endUserPassword: "",
    endUserRoleId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmployeeChange = (employeeId: string) => {
    setFormData({ ...formData, employeeId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (
      !formData.employeeId ||
      !formData.endUserName ||
      !formData.endUserPassword ||
      !formData.endUserRoleId
    ) {
      alert("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addRecord("EndUser", formData);
      alert(`Successfully registered user: ${formData.endUserName}`);
      navigate({ to: "/table/EndUser" });
    } catch (error) {
      alert(
        "Registration failed. Please check the console or ensure the username is unique.",
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================================
  // NEW: Find the selected role to preview its permissions
  // ========================================================
  const selectedRoleInfo = roles.find(
    (r) => String(r.endUserRoleId) === String(formData.endUserRoleId),
  );

  // Extract only the permissions that are granted (true or 1)
  const grantedPermissions = selectedRoleInfo
    ? Object.entries(selectedRoleInfo)
        .filter(
          ([key, value]) =>
            // Ignore ID, Name, and Date fields
            !key.toLowerCase().includes("id") &&
            !key.toLowerCase().includes("name") &&
            !key.toLowerCase().includes("date") &&
            // Keep only truthy/granted values
            (value === 1 || value === true),
        )
        .map(([key]) => key)
    : [];

  return (
    // ProtectedRoute locked down to Admin only!
    <ProtectedRoute requireAdmin={false}>
      <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
          <div className="mb-8 flex items-center gap-4">
            <button
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200"
              onClick={() => {
                window.history.back();
              }}
              title="Go Back"
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
                Register New User
              </h1>
              <p className="text-sm text-gray-500 md:text-base">
                Create a new account and assign system access.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-2xl overflow-visible rounded-2xl bg-white p-6 shadow-lg md:p-10">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* LINKED EMPLOYEE (Searchable) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  Link to Employee
                </label>
                <SearchableSelect
                  onChange={handleEmployeeChange}
                  options={employees.map((emp) => ({
                    label: emp.employeeFullName || "Unnamed",
                    value: emp.employeeId,
                  }))}
                  placeholder="-- Select an Employee --"
                  value={formData.employeeId}
                />
              </div>

              {/* USERNAME */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-gray-700"
                  htmlFor="endUserName"
                >
                  Username
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  id="endUserName"
                  name="endUserName"
                  onChange={handleChange}
                  placeholder="juandelacruz_123"
                  required
                  type="text"
                  value={formData.endUserName}
                />
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-gray-700"
                  htmlFor="endUserPassword"
                >
                  Temporary Password
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  id="endUserPassword"
                  name="endUserPassword"
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  type="password"
                  value={formData.endUserPassword}
                />
              </div>

              {/* SYSTEM ROLE WITH LIVE PERMISSION PREVIEW */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-gray-700"
                  htmlFor="endUserRoleId"
                >
                  Account Role
                </label>
                <select
                  className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  id="endUserRoleId"
                  name="endUserRoleId"
                  onChange={handleChange}
                  required
                  value={formData.endUserRoleId}
                >
                  <option disabled value="">
                    -- Select Role --
                  </option>
                  {roles.map((role) => (
                    <option key={role.endUserRoleId} value={role.endUserRoleId}>
                      {role.endUserRoleName}
                    </option>
                  ))}
                </select>

                {/* The Permission Preview Box */}
                {selectedRoleInfo && (
                  <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <h4 className="mb-2 text-xs font-bold tracking-wider text-blue-800 uppercase">
                      Permissions Granted to {selectedRoleInfo.endUserRoleName}:
                    </h4>
                    {grantedPermissions.length > 0 ? (
                      <ul className="grid max-h-40 grid-cols-2 gap-x-4 gap-y-1 overflow-y-auto text-sm text-blue-900 sm:grid-cols-3">
                        {grantedPermissions.map((perm) => (
                          <li className="flex items-center gap-1" key={perm}>
                            <svg
                              className="h-3 w-3 shrink-0 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M5 13l4 4L19 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                            {perm}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        This role currently has no permissions granted.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col-reverse justify-end gap-4 sm:flex-row">
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
                  {isSubmitting ? "Registering..." : "Register User"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// ============================================================================
// CUSTOM COMPONENT: Searchable Dropdown (For selecting Employees)
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

  const selectedOption = options.find((opt) => opt.value === value);

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

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-black focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
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
              placeholder="Search employees..."
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
                  setSearchTerm("");
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
