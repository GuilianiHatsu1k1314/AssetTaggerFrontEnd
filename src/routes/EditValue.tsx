import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sidebar } from "./components/-SideBar";

// 1. Define Search Params to receive the AssetID
type AssetSearch = {
  assetId: string;
};

export const Route = createFileRoute("/EditValue")({
  component: EditAssetPage,
  validateSearch: (search: Record<string, unknown>): AssetSearch => {
    return {
      assetId: (search.assetId as string) || "",
    };
  },
});

function EditAssetPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/EditValue" });

  // 2. Mock Database (In a real app, fetch this from an API using search.assetId)
  const [formData, setFormData] = useState({
    assetId: "0001",
    tagDate: "1/29/2026",
    purchaseDate: "1/20/2026",
    purchasePrice: "₱20000",
    serialNumber: "SN-9F3K",
    warrantyUnit: "mm",
    warrantyDuration: "10",
  });

  // Simulate fetching data based on ID
  useEffect(() => {
    if (search.assetId) {
      // Logic to find specific asset would go here.
      // For now, we just set the ID to match what was clicked.
      setFormData((prev) => ({ ...prev, assetId: search.assetId }));
    }
  }, [search.assetId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving:", formData);
    alert(`Asset ${formData.assetId} updated successfully!`);
    navigate({ to: "/table/Asset" }); // Go back to table
  };

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {/* Breadcrumbs */}
        <div className="mb-8 text-lg font-medium text-black">
          <Link to="/TableSelection" className="hover:underline">
            Table Selection
          </Link>
          <span className="mx-2">&gt;</span>
          <Link to="/table/Asset" className="hover:underline">
            Table Display
          </Link>
          <span className="mx-2">&gt;</span>
          <span>Edit Value</span>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-black">Asset</h1>
        </div>

        {/* EDIT TABLE FORM */}
        <div className="w-full max-w-7xl overflow-hidden rounded-lg shadow-sm">
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

          {/* Data Row (Dark Blue) */}
          <div className="grid grid-cols-7 items-center gap-2 bg-[#1e3a8a] px-2 py-8">
            {/* 1. PRIMARY KEY (Read-Only Text) */}
            <div className="text-center text-xl font-medium text-white">
              {formData.assetId}
            </div>

            {/* 2. Tag Date (Editable) */}
            <div className="flex justify-center">
              <input
                name="tagDate"
                value={formData.tagDate}
                onChange={handleChange}
                className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* 3. Purchase Date (Editable) */}
            <div className="flex justify-center">
              <input
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* 4. Price (Editable) */}
            <div className="flex justify-center">
              <input
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* 5. Serial (Editable) */}
            <div className="flex justify-center">
              <input
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* 6. Warranty Unit (Editable) */}
            <div className="flex justify-center">
              <input
                name="warrantyUnit"
                value={formData.warrantyUnit}
                onChange={handleChange}
                className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* 7. Warranty Duration (Editable) */}
            <div className="flex justify-center">
              <input
                name="warrantyDuration"
                value={formData.warrantyDuration}
                onChange={handleChange}
                className="w-full max-w-[140px] rounded-sm bg-[#dcdcdc] p-2 text-center text-gray-800 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-full bg-blue-600 px-10 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}
