import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { toSvg } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useRef } from "react";

import { ProtectedRoute } from "../components/-ProtectedRoute"; // 1. IMPORT ADDED HERE
import { Sidebar } from "../components/-SideBar";
// 1. Correctly import the hook from the new DatabaseContext
import { useDatabase } from "../context/-AssetContext";

export const Route = createFileRoute("/table/QRPage")({
  component: QRViewPage,
  validateSearch: (search: Record<string, unknown>) => {
    return { assetId: search.assetId as string };
  },
});

// CHANGED: Switched to strict Flexbox widths. 'html-to-image' handles Flex
// much more reliably than CSS Grid when rendering DOM nodes to Canvas/SVG.
function InfoRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-row items-center text-lg">
      <span className="w-48 font-medium text-gray-800">{label}</span>
      <span className="w-8 text-center font-bold text-gray-800">:</span>
      <span className="flex-1 font-bold text-black">{value || "-"}</span>
    </div>
  );
}

function QRViewPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/table/QRPage" });

  // 2. Pull in the live Asset table data using the new context
  const { getTableData } = useDatabase();
  const assets = getTableData("Asset");

  const selectedAsset = assets.find(
    (a) => String(a.assetId) === String(search.assetId),
  );

  useEffect(() => {
    console.log("Searching for ID:", search.assetId);
    console.log("Found Asset:", selectedAsset);
  }, [search.assetId, assets, selectedAsset]);

  const qrCodeValue = selectedAsset
    ? JSON.stringify(selectedAsset)
    : "Asset Not Found";

  // Formatter to ensure the price always shows the Philippine Peso sign
  const rawPrice = selectedAsset?.purchasePrice || "";
  const formattedPrice = rawPrice
    ? String(rawPrice).includes("₱")
      ? rawPrice
      : `₱${rawPrice}`
    : "";

  const fullCardRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = useCallback(
    (ref: React.RefObject<HTMLDivElement>, fileName: string) => {
      if (ref.current === null) {
        return;
      }

      // Changed from toPng to toSvg
      toSvg(ref.current, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        // Force the rendering engine to respect the exact dimensions of the node
        style: { margin: "0", transform: "scale(1)" },
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error("Oops, something went wrong!", err);
          alert("Failed to download image. Please try again.");
        });
    },
    [],
  );

  return (
    // 2. WRAPPER ADDED HERE
    <ProtectedRoute>
      <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
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

          {/* ========================================================= */}
          {/* WRAPPER: Allows scrolling on small screens without breaking the tag's shape */}
          {/* ========================================================= */}
          <div className="w-full overflow-x-auto pb-6">
            {/* THE WEB CARD: Forced to exactly 800px wide for print-perfect consistency */}
            <div
              className="relative mx-auto flex w-[800px] shrink-0 flex-col rounded-sm border-[10px] border-black bg-white px-12 py-14 shadow-lg"
              ref={fullCardRef}
            >
              <div className="mb-14 text-center">
                <h2 className="text-2xl font-bold tracking-wide text-black">
                  JDN HEAD OFFICE
                </h2>
                <h3 className="text-2xl font-bold tracking-wide text-black">
                  NEPOMUCENO REALTY GROUP
                </h3>
                <h4 className="mt-2 text-xl font-normal tracking-wide text-black">
                  PROPERTY TAG
                </h4>
              </div>

              <div className="flex flex-row items-center justify-between px-4">
                {/* Left Side: Data Fields */}
                <div className="flex flex-col space-y-4">
                  <InfoRow
                    label="Asset ID"
                    value={selectedAsset?.assetId || ""}
                  />
                  <InfoRow
                    label="Asset Tag Date"
                    value={selectedAsset?.assetTagDate || ""}
                  />
                  <InfoRow
                    label="Purchase Date"
                    value={selectedAsset?.purchaseDate || ""}
                  />
                  <InfoRow label="Purchase Price" value={formattedPrice} />
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

                {/* Right Side: QR Code Wrapper */}
                <div className="flex shrink-0 items-center justify-center pl-8">
                  <div
                    className="flex h-56 w-56 items-center justify-center border-2 border-gray-300 bg-white p-3"
                    ref={qrCodeRef}
                  >
                    {selectedAsset ? (
                      <div className="flex h-full w-full items-center justify-center bg-white">
                        <QRCodeSVG
                          bgColor={"#ffffff"}
                          fgColor={"#000000"}
                          level={"M"}
                          marginSize={0}
                          size={190}
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
          </div>

          {/* ========================================================= */}
          {/* IMAGE DOWNLOAD BUTTONS */}
          {/* ========================================================= */}
          <div className="mx-auto mt-4 flex max-w-[800px] flex-wrap justify-end gap-4">
            {selectedAsset ? (
              <>
                <button
                  className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-md transition-colors hover:bg-blue-700 md:text-lg"
                  onClick={() => {
                    handleDownloadImage(
                      fullCardRef,
                      // CHANGED .png to .svg here:
                      `PropertyTag_${selectedAsset.assetId}.svg`,
                    );
                  }}
                >
                  <svg
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                  Download Full Tag (SVG)
                </button>

                <button
                  className="flex items-center gap-2 rounded-full border-2 border-black bg-white px-6 py-3 text-base font-bold text-black shadow-md transition-colors hover:bg-gray-100 md:text-lg"
                  onClick={() => {
                    handleDownloadImage(
                      qrCodeRef,
                      // CHANGED .png to .svg here:
                      `QRCode_${selectedAsset.assetId}.svg`,
                    );
                  }}
                >
                  <svg
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                  Download QR Code (SVG)
                </button>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
