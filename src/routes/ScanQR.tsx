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
            Scan QR
          </h1>
        </div>

        {/* Center Container for the Scanning Card */}
        <div className="mt-4 flex items-start justify-center md:mt-10">
          {/* The Blue Card */}
          <div className="relative flex w-full max-w-md flex-col items-center justify-center bg-[#567bfb] p-6 shadow-xl md:aspect-square md:p-12">
            {/* Camera Container */}
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden border-4 border-gray-400 bg-black shadow-inner">
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
              <div className="mt-8 flex w-full flex-col items-center gap-4">
                <div className="w-full bg-white p-3 text-center shadow-sm">
                  <span className="text-sm text-gray-500">Scanned ID:</span>
                  <p className="text-lg font-bold text-black">{scannedValue}</p>
                </div>

                <div className="flex w-full gap-2">
                  <button
                    className="flex-1 rounded-sm border-2 border-white py-2 font-bold text-white transition-colors hover:bg-white hover:text-[#567bfb]"
                    onClick={handleScanAgain}
                  >
                    Rescan
                  </button>
                  <button
                    className="flex-1 rounded-sm bg-blue-900 py-2 font-bold text-white shadow-md transition-colors hover:bg-blue-800"
                    onClick={handleViewAsset}
                  >
                    View Asset
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-8 text-lg font-medium text-black">
                Point camera at QR Code
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
