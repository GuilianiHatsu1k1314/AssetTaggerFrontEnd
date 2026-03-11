import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

import { Sidebar } from "./components/-SideBar";
import { useAssetContext } from "./context/-AssetContext"; // <-- 1. Imported context

export const Route = createFileRoute("/ScanQR")({
  component: ScanQRPage,
});

function ScanQRPage() {
  const navigate = useNavigate();
  const { assets } = useAssetContext(); // <-- 2. Pull in the Asset table data

  const [isPaused, setIsPaused] = useState(false);
  const [scannedId, setScannedId] = useState<null | string>(null);
  const [manualInput, setManualInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 3. Centralized validation function
  const processAssetId = (rawString: string) => {
    let extractedId = rawString;

    // The QR code from QRPage encodes a full JSON object. We only want the ID.
    try {
      const parsed = JSON.parse(rawString);
      if (parsed?.assetId) {
        extractedId = String(parsed.assetId);
      }
    } catch (e) {
      // If it's not JSON, assume they scanned a plain text barcode
      extractedId = String(rawString);
    }

    // Validate that this ID actually exists in the Asset table
    const foundAsset = assets.find(
      (a) => String(a.assetId) === extractedId.trim(),
    );

    if (foundAsset) {
      setScannedId(String(foundAsset.assetId));
      setErrorMsg("");
      setIsPaused(true);
    } else {
      setErrorMsg(`Asset ID "${extractedId}" not found in database.`);
      setScannedId(null);
      setIsPaused(true); // Pause to show the error
    }
  };

  // Handle successful camera scan
  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      processAssetId(detectedCodes[0].rawValue);
    }
  };

  // Handle manual input submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    processAssetId(manualInput);
  };

  // Reset scanner
  const handleScanAgain = () => {
    setScannedId(null);
    setErrorMsg("");
    setManualInput("");
    setIsPaused(false);
  };

  // Navigate to the Tag Card
  const handleViewAsset = () => {
    if (scannedId) {
      navigate({ search: { assetId: scannedId }, to: "/table/QRPage" });
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
        {/* Header: Back Button & Title */}
        <div className="mb-6 flex items-center gap-4 md:mb-8">
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Scan QR Code
          </h1>
        </div>

        {/* Center Container for the Scanning Card */}
        <div className="mt-4 flex items-start justify-center md:mt-10">
          <div className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-blue-50 p-3 text-blue-600">
                <svg
                  fill="none"
                  height="28"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="28"
                >
                  <rect height="5" rx="1" width="5" x="3" y="3"></rect>
                  <rect height="5" rx="1" width="5" x="16" y="3"></rect>
                  <rect height="5" rx="1" width="5" x="3" y="16"></rect>
                  <path d="M21 16v5"></path>
                  <path d="M16 21h5"></path>
                  <path d="M16 16h5"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Lookup Asset</h2>
              <p className="mt-1 text-sm text-gray-500">
                Scan a tag or enter an ID manually.
              </p>
            </div>

            {/* Camera Container */}
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-4 border-gray-100 bg-gray-900 shadow-inner">
              <Scanner
                components={{
                  audio: false,
                  finder: true,
                  onOff: false,
                  torch: true,
                }}
                constraints={{
                  aspectRatio: 1,
                  facingMode: "environment",
                }}
                onError={(error) => {
                  console.error(error);
                }}
                onScan={handleScan}
                paused={isPaused}
              />
            </div>

            {/* --- DYNAMIC CONTROLS --- */}

            {/* 1. SUCCESS STATE (Compact) */}
            {isPaused && scannedId ? (
              <div className="animate-in slide-in-from-bottom-2 fade-in mt-6 flex w-full flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-green-700">
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
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-sm font-bold tracking-wider uppercase">
                      Asset Found:
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {scannedId}
                  </span>
                </div>

                <div className="flex w-full gap-2">
                  <button
                    className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                    onClick={handleScanAgain}
                  >
                    Scan Again
                  </button>
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    onClick={handleViewAsset}
                  >
                    View Tag Card
                  </button>
                </div>
              </div>
            ) : // 2. ERROR STATE
            isPaused && errorMsg ? (
              <div className="animate-in fade-in mt-6 flex w-full flex-col items-center gap-4">
                <div className="w-full rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-600 shadow-sm">
                  {errorMsg}
                </div>
                <button
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                  onClick={handleScanAgain}
                >
                  Try Again
                </button>
              </div>
            ) : (
              // 3. IDLE / SCANNING STATE
              <div className="mt-6 flex w-full flex-col gap-4">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                  </span>
                  Waiting for QR code...
                </div>

                <div className="flex items-center gap-4 text-gray-300">
                  <hr className="flex-1 border-gray-200" />
                  <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    Or
                  </span>
                  <hr className="flex-1 border-gray-200" />
                </div>

                <form className="flex gap-2" onSubmit={handleManualSubmit}>
                  <input
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    onChange={(e) => {
                      setManualInput(e.target.value);
                    }}
                    placeholder="Enter Asset ID"
                    type="text"
                    value={manualInput}
                  />
                  <button
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:opacity-50"
                    disabled={!manualInput.trim()}
                    type="submit"
                  >
                    Find
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
