import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";

import { Sidebar } from "../components/-SideBar";
import { useAssetContext } from "../context/-AssetContext";

export const Route = createFileRoute("/table/QRPage")({
  component: QRViewPage,
  validateSearch: (search: Record<string, unknown>) => {
    return { assetId: search.assetId as string };
  },
});

function InfoRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="grid grid-cols-[220px_20px_1fr] items-start">
      <span className="font-medium text-gray-800">{label}</span>
      <span className="text-center font-bold text-gray-800">:</span>
      <span className="truncate font-bold text-black">{value || "-"}</span>
    </div>
  );
}

function QRViewPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/table/QRPage" });
  const { assets } = useAssetContext();

  // Find the asset matching the ID in the URL
  const selectedAsset = assets.find(
    (a) => String(a.assetId) === String(search.assetId),
  );

  // DEBUGGING: Verify we found the right asset
  useEffect(() => {
    console.log("Searching for ID:", search.assetId);
    console.log("Found Asset:", selectedAsset);
  }, [search.assetId, assets, selectedAsset]);

  // Generate the string for the QR code (contains full data)
  const qrCodeValue = selectedAsset
    ? JSON.stringify(selectedAsset)
    : "Asset Not Found";

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4 md:mb-8">
          <button
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200"
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
          <h1 className="text-xl font-medium text-black md:text-3xl">
            QR Code for Asset ID:{" "}
            <span className="font-bold text-blue-600">{search.assetId}</span>
          </h1>
        </div>

        {/* The Card */}
        <div className="relative mx-auto max-w-5xl rounded-sm border-8 border-black p-6 shadow-lg md:p-16">
          <div className="mb-10 space-y-1 text-center md:mb-16">
            <h2 className="text-lg font-bold tracking-wide text-black md:text-xl">
              JDN HEAD OFFICE
            </h2>
            <h3 className="text-lg font-bold tracking-wide text-black md:text-xl">
              NEPOMUCENO REALTY GROUP
            </h3>
            <h4 className="text-lg font-normal tracking-wide text-black md:text-xl">
              PROPERTY TAG
            </h4>
          </div>

          <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start md:gap-12">
            {/* Left Side: Data Fields matching Asset.tsx columns */}
            <div className="w-full max-w-lg flex-1 space-y-3 text-base md:space-y-4 md:text-lg">
              <InfoRow label="Asset ID" value={selectedAsset?.assetId || ""} />
              <InfoRow
                label="Asset Tag Date"
                value={selectedAsset?.assetTagDate || ""}
              />
              <InfoRow
                label="Purchase Date"
                value={selectedAsset?.purchaseDate || ""}
              />
              <InfoRow
                label="Purchase Price"
                value={selectedAsset?.purchasePrice || ""}
              />
              <InfoRow
                label="Serial Number"
                value={selectedAsset?.serialNumber || ""}
              />
              <InfoRow
                label="Warranty Unit"
                value={selectedAsset?.warrantyUnit || ""}
              />
              <InfoRow
                label="Warranty Duration"
                value={selectedAsset?.warrantyDuration || ""}
              />
            </div>

            {/* Right Side: QR Code */}
            <div className="flex items-center justify-center md:mr-12">
              <div className="flex h-56 w-56 items-center justify-center border border-gray-400 bg-white p-4 shadow-inner md:h-64 md:w-64">
                {selectedAsset ? (
                  <div className="flex h-full w-full items-center justify-center bg-white p-2">
                    <QRCodeSVG
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"M"}
                      marginSize={0}
                      size={200}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      value={qrCodeValue}
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="mb-2 font-bold text-red-500">
                      Asset Not Found
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {search.assetId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
