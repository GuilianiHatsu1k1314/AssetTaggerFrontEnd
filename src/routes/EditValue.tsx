import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Sidebar } from "./components/-SideBar"; // Keep your exact path
import { useAssetContext } from "./context/-AssetContext"; // Import your Context

// 1. Define expected search params for TanStack Router
export const Route = createFileRoute("/EditValue")({
  component: EditValuePage,
  validateSearch: (search: Record<string, unknown>) => {
    return { assetId: search.assetId as string };
  },
});

function EditValuePage() {
  const navigate = useNavigate();

  // 2. Get the assetId that was clicked on from the URL
  const search = useSearch({ from: "/EditValue" });

  // 3. Pull assets and the update function from your Context
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

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save Changes back to Global Context
  const handleSave = () => {
    updateAsset(search.assetId, formData);
    alert("Asset updated successfully!");
    navigate({ to: "/table/Asset" }); // Go back to table
  };

  return (
    // Responsive main wrapper: flex-col on mobile, flex-row on desktop
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
        {/* Header: Back Button & Title */}
        <div className="mb-6 flex items-center gap-4 md:mb-8">
          <button
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200"
            onClick={() => {
              window.history.back();
            }}
          >
            {/* Back Arrow Icon */}
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

        {/* Title */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black">Asset</h2>
        </div>

        {/* The Form Table (Modeled after your AddValue layout) */}
        <div className="w-full max-w-5xl overflow-x-auto rounded-lg shadow-sm">
          <div className="min-w-[800px] md:min-w-full">
            {/* Header Row (Light Blue) */}
            <div className="grid grid-cols-7 gap-2 bg-[#567bfb] px-2 py-6 text-center">
              <div className="text-lg font-bold text-black">AssetID</div>
              <div className="text-lg font-bold text-black">
                AssetTag
                <br />
                Date
              </div>
              <div className="text-lg font-bold text-black">
                AssetPurchase
                <br />
                Date
              </div>
              <div className="text-lg font-bold text-black">
                AssetPurchase
                <br />
                Price
              </div>
              <div className="text-lg font-bold text-black">
                AssetSerial
                <br />
                Number
              </div>
              <div className="text-lg font-bold text-black">
                AssetWarrantyUnit
                <br />
                OfMeasure
              </div>
              <div className="text-lg font-bold text-black">
                AssetWarranty
                <br />
                Duration
              </div>
            </div>

            {/* Input Row (Dark Blue) */}
            <div className="grid grid-cols-7 items-center gap-2 bg-[#1e3a8a] px-2 py-4">
              {/* 1. PRIMARY KEY (Read-Only Text) */}
              <div className="text-center text-xl font-medium text-white">
                {search.assetId}
              </div>

              {/* 2. Tag Date (Editable) */}
              <div className="flex justify-center">
                <input
                  className="w-full max-w-[120px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                  name="assetTagDate"
                  onChange={handleChange}
                  value={formData.assetTagDate}
                />
              </div>

              {/* 3. Purchase Date (Editable) */}
              <div className="flex justify-center">
                <input
                  className="w-full max-w-[120px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                  name="purchaseDate"
                  onChange={handleChange}
                  value={formData.purchaseDate}
                />
              </div>

              {/* 4. Price (Editable) */}
              <div className="flex justify-center">
                <input
                  className="w-full max-w-[120px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                  name="purchasePrice"
                  onChange={handleChange}
                  value={formData.purchasePrice}
                />
              </div>

              {/* 5. Serial (Editable) */}
              <div className="flex justify-center">
                <input
                  className="w-full max-w-[120px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                  name="serialNumber"
                  onChange={handleChange}
                  value={formData.serialNumber}
                />
              </div>

              {/* 6. Warranty Unit (Editable) */}
              <div className="flex justify-center">
                <input
                  className="w-full max-w-[120px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                  name="warrantyUnit"
                  onChange={handleChange}
                  value={formData.warrantyUnit}
                />
              </div>

              {/* 7. Warranty Duration (Editable) */}
              <div className="flex justify-center">
                <input
                  className="w-full max-w-[120px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
                  name="warrantyDuration"
                  onChange={handleChange}
                  type="number"
                  value={formData.warrantyDuration}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            className="rounded-full bg-blue-600 px-10 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}
