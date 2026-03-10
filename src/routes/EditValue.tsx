import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Sidebar } from "./components/-SideBar";
import { useAssetContext } from "./context/-AssetContext";

// 1. Define expected search params for TanStack Router
export const Route = createFileRoute("/EditValue")({
  component: EditValuePage,
  validateSearch: (search: Record<string, unknown>) => {
    return { assetId: search.assetId as string };
  },
});

function EditValuePage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/EditValue" });
  const { assets, updateAsset } = useAssetContext();

  // Local state for the form inputs
  const [formData, setFormData] = useState({
    assetTagDate: "",
    purchaseDate: "",
    purchasePrice: "",
    serialNumber: "",
    warrantyDuration: 0,
    warrantyUnit: "",
  });

  // Load the specific asset data when the page opens
  useEffect(() => {
    const selectedAsset = assets.find((a) => a.assetId === search.assetId);
    if (selectedAsset) {
      setFormData({
        assetTagDate: selectedAsset.assetTagDate,
        purchaseDate: selectedAsset.purchaseDate,
        purchasePrice: selectedAsset.purchasePrice,
        serialNumber: selectedAsset.serialNumber,
        warrantyDuration: selectedAsset.warrantyDuration,
        warrantyUnit: selectedAsset.warrantyUnit,
      });
    }
  }, [search.assetId, assets]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateAsset(search.assetId, formData);
    alert("Asset updated successfully!");
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
          <span className="text-gray-900">Edit Value</span>
        </div>

        {/* Header Section */}
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
              Edit Asset
            </h1>
            <p className="mt-1 text-sm text-gray-500 md:text-base">
              Update the details for Asset ID:{" "}
              <span className="font-semibold text-blue-600">
                {search.assetId}
              </span>
            </p>
          </div>
        </div>

        {/* CONTAINER WRAPPER: Limits both table and button to 1400px */}
        <div className="w-full max-w-[1400px]">
          {/* Modern Table Container */}
          <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] table-auto text-left text-sm">
                {/* Table Header */}
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Asset ID
                    </th>
                    <th className="px-4 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Tag Date
                    </th>
                    <th className="px-4 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Purchase Date
                    </th>
                    <th className="px-4 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Purchase Price
                    </th>
                    <th className="px-4 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Serial Number
                    </th>
                    <th className="px-4 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Warranty Unit
                    </th>
                    <th className="px-4 py-4 align-middle text-xs font-bold tracking-wider text-gray-500 uppercase">
                      Warranty Duration
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white">
                  <tr className="hover:bg-gray-50">
                    {/* Read-Only Asset ID */}
                    <td className="px-4 py-4 align-middle">
                      <div className="flex w-full min-w-[100px] items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700">
                        {search.assetId}
                      </div>
                    </td>

                    {/* Tag Date */}
                    <td className="px-4 py-4 align-middle">
                      <input
                        className="w-full min-w-[140px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        name="assetTagDate"
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                        value={formData.assetTagDate}
                      />
                    </td>

                    {/* Purchase Date */}
                    <td className="px-4 py-4 align-middle">
                      <input
                        className="w-full min-w-[140px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        name="purchaseDate"
                        onChange={handleChange}
                        placeholder="MM/DD/YYYY"
                        value={formData.purchaseDate}
                      />
                    </td>

                    {/* Purchase Price */}
                    <td className="px-4 py-4 align-middle">
                      <input
                        className="w-full min-w-[140px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        name="purchasePrice"
                        onChange={handleChange}
                        placeholder="e.g. 20000"
                        value={formData.purchasePrice}
                      />
                    </td>

                    {/* Serial Number */}
                    <td className="px-4 py-4 align-middle">
                      <input
                        className="w-full min-w-[140px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        name="serialNumber"
                        onChange={handleChange}
                        placeholder="e.g. SN-9F3K"
                        value={formData.serialNumber}
                      />
                    </td>

                    {/* Warranty Unit Dropdown */}
                    <td className="px-4 py-4 align-middle">
                      <select
                        className="w-full min-w-[140px] cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        name="warrantyUnit"
                        onChange={handleChange}
                        value={formData.warrantyUnit}
                      >
                        <option disabled value="">
                          -- Select --
                        </option>
                        <option value="mm">mm (Month)</option>
                        <option value="yy">yy (Year)</option>
                      </select>
                    </td>

                    {/* Warranty Duration */}
                    <td className="px-4 py-4 align-middle">
                      <input
                        className="w-full min-w-[140px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        name="warrantyDuration"
                        onChange={handleChange}
                        placeholder="e.g. 12"
                        type="number"
                        value={formData.warrantyDuration}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Save Button */}
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
