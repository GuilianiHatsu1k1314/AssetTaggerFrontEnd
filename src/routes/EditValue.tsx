import {
  createFileRoute,
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
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 md:mb-8">
          <button
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200"
            onClick={() => {
              window.history.back();
            }}
          >
            <svg
              className="md:h-8 md:w-8"
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
          <h1 className="text-xl font-medium text-black md:text-3xl">
            Edit Value
          </h1>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black">Asset</h2>
        </div>

        {/* CONTAINER WRAPPER: Limits both table and button to 1400px */}
        <div className="w-full max-w-[1400px]">
          {/* Table Container */}
          <div className="w-full overflow-x-auto rounded-lg shadow-sm">
            <div className="min-w-[1200px]">
              {/* Header Row */}
              <div className="grid grid-cols-7 gap-2 bg-[#567bfb] px-2 py-6 text-center">
                <div className="flex items-center justify-center text-sm font-bold text-black">
                  AssetID
                </div>
                <div className="flex items-center justify-center text-sm font-bold text-black">
                  Asset Tag Date
                </div>
                <div className="flex items-center justify-center text-sm font-bold text-black">
                  Asset Purchase Date
                </div>
                <div className="flex items-center justify-center text-sm font-bold text-black">
                  Asset Purchase Price
                </div>
                <div className="flex items-center justify-center text-sm font-bold text-black">
                  Asset Serial Number
                </div>
                <div className="flex items-center justify-center text-sm font-bold text-black">
                  Asset Warranty Unit Of Measure
                </div>
                <div className="flex items-center justify-center text-sm font-bold text-black">
                  Asset Warranty Duration
                </div>
              </div>

              {/* Input Row */}
              <div className="grid grid-cols-7 items-center gap-2 bg-[#1e3a8a] px-2 py-4">
                <div className="text-center text-xl font-medium text-white">
                  {search.assetId}
                </div>

                <div className="flex justify-center">
                  <input
                    className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                    name="assetTagDate"
                    onChange={handleChange}
                    value={formData.assetTagDate}
                  />
                </div>

                <div className="flex justify-center">
                  <input
                    className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                    name="purchaseDate"
                    onChange={handleChange}
                    value={formData.purchaseDate}
                  />
                </div>

                <div className="flex justify-center">
                  <input
                    className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                    name="purchasePrice"
                    onChange={handleChange}
                    value={formData.purchasePrice}
                  />
                </div>

                <div className="flex justify-center">
                  <input
                    className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                    name="serialNumber"
                    onChange={handleChange}
                    value={formData.serialNumber}
                  />
                </div>

                <div className="flex justify-center">
                  <select
                    className="w-full max-w-[140px] cursor-pointer appearance-none rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                    name="warrantyUnit"
                    onChange={handleChange}
                    value={formData.warrantyUnit}
                  >
                    <option value="">--Select--</option>
                    <option value="mm">mm (Month)</option>
                    <option value="yy">yy (Year)</option>
                  </select>
                </div>

                <div className="flex justify-center">
                  <input
                    className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                    name="warrantyDuration"
                    onChange={handleChange}
                    type="number"
                    value={formData.warrantyDuration}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button - Now inside the 1400px wrapper, so it aligns with the table edge */}
          <div className="mt-8 flex justify-end">
            <button
              className="rounded-full bg-blue-600 px-10 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
