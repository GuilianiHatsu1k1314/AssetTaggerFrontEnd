import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "../components/-SideBar"; // 1. Import Sidebar

export const Route = createFileRoute("/table/QRPage")({
  component: QRViewPage,
});

function QRViewPage() {
  const navigate = useNavigate();

  // Dummy Data (Based on your table's first row)
  const assetData = {
    productName: "Laptop",
    modelNumber: "XPS 15",
    serialNumber: "SN-9F3K",
    issuedTo: "John Doe",
    department: "IT Dept",
    location: "Head Office",
    dateTagged: "1/29/2026",
  };

  return (
    // 2. Main Layout Wrapper (Flex + Height Screen)
    <div className="flex h-screen w-full bg-gray-50">
      {/* 3. Sidebar on the Left */}
      <Sidebar />
      {/* 4. Main Content Area (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Header: Back Button & Title */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200"
          >
            {/* Back Arrow Icon */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 className="text-3xl font-medium text-black">
            QR Code for Asset ID:
          </h1>
        </div>

        {/* Main Blue Card */}
        <div className="relative mx-auto max-w-5xl rounded-sm bg-[#567bfb] p-12 shadow-lg md:p-16">
          {/* Card Header Text (Centered) */}
          <div className="mb-16 space-y-1 text-center">
            <h2 className="text-xl font-bold tracking-wide text-black">
              JDN HEAD OFFICE
            </h2>
            <h3 className="text-xl font-bold tracking-wide text-black">
              NEPOMUCENO REALTY GROUP
            </h3>
            <h4 className="text-xl font-normal tracking-wide text-black">
              PROPERTY TAG
            </h4>
          </div>

          {/* Content Grid */}
          <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
            {/* Left Side: Labels & Values */}
            <div className="w-full max-w-lg flex-1 space-y-4 text-lg font-medium text-black">
              <InfoRow label="Product Name" value={assetData.productName} />
              <InfoRow label="Model Number" value={assetData.modelNumber} />
              <InfoRow label="Serial Number" value={assetData.serialNumber} />
              <InfoRow label="Issued to" value={assetData.issuedTo} />
              <InfoRow label="Department" value={assetData.department} />
              <InfoRow label="Location" value={assetData.location} />
              <InfoRow label="Date Tagged" value={assetData.dateTagged} />
            </div>

            {/* Right Side: QR Code Box */}
            <div className="flex items-center justify-center md:mr-12">
              <div className="flex h-56 w-56 items-center justify-center border border-gray-400 bg-[#dcdcdc] shadow-inner">
                <span className="text-xl font-medium text-black">QR CODE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button (Bottom Right) */}
        <div className="mx-auto mt-4 flex max-w-5xl justify-end">
          <button className="flex items-center gap-2 text-lg font-bold text-black transition-colors hover:text-blue-700">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download
          </button>
        </div>
      </main>
    </div>
  );
}

// Helper Component for alignment
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[160px_20px_1fr]">
      <span className="whitespace-nowrap">{label}</span>
      <span className="text-center">:</span>
      <span className="truncate">{value}</span>
    </div>
  );
}
