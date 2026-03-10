import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

import { Sidebar } from "./components/-SideBar"; // Adjust path if needed

// 1. Create Route matching the Sidebar link
export const Route = createFileRoute("/ScanQR")({
  component: ScanQRPage,
});

function ScanQRPage() {
  const navigate = useNavigate();

  // State to track if the scanner is paused and what it found
  const [isPaused, setIsPaused] = useState(false);
  const [scannedValue, setScannedValue] = useState<null | string>(null);

  // 2. Handle the scan result
  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue;

      console.log("Detected QR Code:", code);
      setScannedValue(code);
      setIsPaused(true); // Pause the camera automatically after a successful scan
    }
  };

  // 3. Reset the scanner to try again
  const handleScanAgain = () => {
    setScannedValue(null);
    setIsPaused(false);
  };

  // 4. Navigate to the asset view page
  const handleViewAsset = () => {
    if (scannedValue) {
      // Passes the scanned value as the assetId to your QR page
      navigate({ search: { assetId: scannedValue }, to: "/table/QRPage" });
    }
  };

  return (
    // Main Layout Wrapper
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
        {/* Header: Back Button & Title */}
        <div className="mb-6 flex items-center gap-4 md:mb-8">
          <button
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onClick={() => {
              window.history.back();
            }}
          >
            {/* Back Arrow Icon */}
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
          {/* Modernized White Card */}
          <div className="flex w-full max-w-lg flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-xl md:p-10">
            {/* Contextual Icon / Header for the card */}
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
              <h2 className="text-xl font-bold text-gray-800">Scan Asset</h2>
              <p className="text-sm text-gray-500">
                Center the QR code inside the frame to scan.
              </p>
            </div>

            {/* Camera Container (Rounded and styled) */}
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-4 border-gray-100 bg-gray-900 shadow-inner">
              <Scanner
                components={{
                  audio: true, // Plays a beep on success
                  finder: true, // Shows the square targeting overlay
                  onOff: false, // Hides the built-in pause button since we built our own
                  torch: true, // Adds a flashlight button if the device supports it
                }}
                constraints={{
                  aspectRatio: 1, // Keeps the camera feed square
                  facingMode: "environment", // Uses the rear camera by default
                }}
                onError={(error) => {
                  console.error(error);
                }}
                onScan={handleScan}
                paused={isPaused}
              />
            </div>

            {/* Dynamic Controls based on scan state */}
            {isPaused && scannedValue ? (
              <div className="animate-in slide-in-from-bottom-2 fade-in mt-6 flex w-full flex-col items-center gap-5">
                {/* Result Display */}
                <div className="w-full rounded-lg border border-green-200 bg-green-50 p-4 text-center shadow-sm">
                  <span className="text-xs font-bold tracking-wider text-green-600 uppercase">
                    Scanned Successfully
                  </span>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {scannedValue}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex w-full flex-col gap-3 sm:flex-row">
                  <button
                    className="flex-1 rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                    onClick={handleScanAgain}
                  >
                    Scan Again
                  </button>
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    onClick={handleViewAsset}
                  >
                    <span>View Asset</span>
                    <svg
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="16"
                    >
                      <line x1="5" x2="19" y1="12" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-blue-600">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                </span>
                Waiting for QR code...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
