import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "./components/-SideBar"; // Adjust path if needed

export const Route = createFileRoute("/EditValue")({
  component: QRViewPage,
});

function QRViewPage() {
  const navigate = useNavigate();

  // Dummy Data
  // Using empty strings here so the mobile view shows the "--Edit Value--" placeholder
  const assetData = {
    productName: "",
    modelNumber: "",
    serialNumber: "",
    issuedTo: "",
    department: "",
    location: "",
    dateTagged: "",
  };

  return (
    // Responsive main wrapper: flex-col on mobile (for bottom nav), flex-row on desktop
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row">
      {/* Sidebar / Mobile Bottom Nav */}
      <Sidebar />
      {/* Main Content Area */}
      {/* Added pb-28 so mobile users can scroll past the bottom navigation bar */}
      <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-8">
        {/* Header: Back Button & Title */}
        <div className="mb-6 flex items-center gap-4 md:mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200"
          >
            {/* Back Arrow Icon */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:h-8 md:w-8"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 className="text-xl font-medium text-black md:text-3xl">
            QR Code for Asset ID:
          </h1>
        </div>

        {/* Main Blue Card */}
        {/* p-6 on mobile, p-12/16 on desktop */}
        <div className="relative mx-auto w-full max-w-5xl rounded-sm bg-[#567bfb] p-6 shadow-lg md:p-16">
          {/* Card Header Text (Centered) */}
          <div className="mb-8 space-y-1 text-center md:mb-16">
            <h2 className="text-sm font-bold tracking-wide text-black md:text-xl">
              JDN HEAD OFFICE
            </h2>
            <h3 className="text-sm font-bold tracking-wide text-black md:text-xl">
              NEPOMUCENO REALTY GROUP
            </h3>
            <h4 className="text-sm font-normal tracking-wide text-black md:text-xl">
              PROPERTY TAG
            </h4>
          </div>

          {/* Content Grid (Stacks vertically on mobile, horizontal on md+) */}
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start md:gap-12">
            {/* Left Side: Labels & Values */}
            <div className="w-full max-w-lg flex-1 space-y-3 text-black md:space-y-4 md:text-lg md:font-medium">
              <InfoRow label="Product Name" value={assetData.productName} />
              <InfoRow label="Model Number" value={assetData.modelNumber} />
              <InfoRow label="Serial Number" value={assetData.serialNumber} />
              <InfoRow label="Issued to" value={assetData.issuedTo} />
              <InfoRow label="Department" value={assetData.department} />
              <InfoRow label="Location" value={assetData.location} />
              <InfoRow label="Date Tagged" value={assetData.dateTagged} />
            </div>

            {/* Right Side: QR Code Box */}
            <div className="flex w-full items-center justify-center md:mr-12 md:w-auto">
              {/* Scaled down QR box for mobile, normal size for desktop */}
              <div className="flex h-40 w-40 items-center justify-center border border-gray-400 bg-[#dcdcdc] shadow-inner md:h-56 md:w-56">
                <span className="text-base font-medium text-black md:text-xl">
                  QR CODE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button (Bottom Right) */}
        <div className="mx-auto mt-4 flex max-w-5xl justify-end">
          <button className="flex items-center gap-2 text-base font-bold text-black transition-colors hover:text-blue-700 md:text-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:h-6 md:w-6"
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

// ---------------------------------------------------------
// Helper Component: Responsive Info Row
// ---------------------------------------------------------
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 md:grid md:grid-cols-[160px_20px_1fr] md:gap-0">
      {/* Label */}
      <span className="w-28 text-xs font-bold whitespace-nowrap md:w-auto md:text-lg md:font-medium">
        {label}
      </span>

      {/* Colon */}
      <span className="w-3 text-center text-xs font-bold md:w-auto md:text-lg md:font-medium">
        :
      </span>

      {/* Value Box (Grey box on mobile, plain text on desktop) */}
      <div className="flex-1 bg-[#dcdcdc] px-2 py-1 text-center text-[11px] font-semibold text-gray-500 md:bg-transparent md:px-0 md:py-0 md:text-left md:text-lg md:font-medium md:text-black">
        {value || "--Edit Value--"}
      </div>
    </div>
  );
}
