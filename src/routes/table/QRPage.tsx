import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
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

// ============================================================================
// 1. PDF STYLES & COMPONENTS
// ============================================================================
const pdfStyles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    borderStyle: "solid",
    borderWidth: 3,
    height: 230,
    padding: 20,
    width: 400,
  },
  colon: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    width: 10,
  },
  contentRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flex: 1,
    paddingRight: 10,
  },
  header: {
    marginBottom: 15,
  },
  headerSubtitle: {
    fontFamily: "Helvetica",
    fontSize: 9,
    textAlign: "center",
  },
  headerTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    marginBottom: 2,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontFamily: "Helvetica",
    fontSize: 8,
    width: 90,
  },
  page: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    padding: 20,
  },
  qrBoxWrapper: {
    alignItems: "center",
    borderColor: "#cccccc",
    borderStyle: "solid",
    borderWidth: 1,
    height: 85,
    justifyContent: "center",
    padding: 6,
    width: 85,
  },
  qrImage: {
    height: "100%",
    width: "100%",
  },
  value: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
});

const PdfInfoRow = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <View style={pdfStyles.infoRow}>
    <Text style={pdfStyles.label}>{label}</Text>
    <Text style={pdfStyles.colon}>:</Text>
    <Text style={pdfStyles.value}>{value || "-"}</Text>
  </View>
);

// The actual PDF Document Layout
const AssetPDF = ({ asset, qrCodeUrl }: { asset: any; qrCodeUrl: string }) => {
  // --- FIX: Safely convert '₱' to 'PHP ' so the PDF font can render it properly ---
  const formattedPrice = asset?.purchasePrice
    ? String(asset.purchasePrice).replace("₱", "PHP ")
    : "";

  return (
    <Document>
      <Page orientation="landscape" size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.card} wrap={false}>
          <View style={pdfStyles.header}>
            <Text style={pdfStyles.headerTitle}>JDN HEAD OFFICE</Text>
            <Text style={pdfStyles.headerTitle}>NEPOMUCENO REALTY GROUP</Text>
            <Text style={pdfStyles.headerSubtitle}>PROPERTY TAG</Text>
          </View>

          <View style={pdfStyles.contentRow}>
            <View style={pdfStyles.detailsContainer}>
              <PdfInfoRow label="Asset ID" value={asset?.assetId} />
              <PdfInfoRow label="Asset Tag Date" value={asset?.assetTagDate} />
              <PdfInfoRow label="Purchase Date" value={asset?.purchaseDate} />
              {/* Using the formatted price here */}
              <PdfInfoRow label="Purchase Price" value={formattedPrice} />
              <PdfInfoRow label="Serial Number" value={asset?.serialNumber} />
              <PdfInfoRow label="Warranty Unit" value={asset?.warrantyUnit} />
              <PdfInfoRow
                label="Warranty Duration"
                value={asset?.warrantyDuration}
              />
            </View>

            <View style={pdfStyles.qrBoxWrapper}>
              <Image src={qrCodeUrl} style={pdfStyles.qrImage} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// ============================================================================
// 2. WEB PAGE COMPONENTS (HTML/Tailwind)
// ============================================================================
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

  const pdfQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeValue)}`;

  return (
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

        {/* The Web Card */}
        <div className="relative mx-auto max-w-5xl rounded-sm border-8 border-black bg-white p-6 shadow-lg md:p-16">
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

            <div className="flex items-center justify-center md:mr-12">
              <div className="flex h-48 w-48 items-center justify-center border border-gray-300 bg-white p-4 md:h-56 md:w-56">
                {selectedAsset ? (
                  <div className="flex h-full w-full items-center justify-center bg-white p-2">
                    <QRCodeSVG
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"M"}
                      marginSize={0}
                      size={180}
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

        {/* PDF DOWNLOAD BUTTON */}
        <div className="mx-auto mt-8 flex max-w-5xl justify-end">
          {selectedAsset ? (
            <PDFDownloadLink
              document={
                <AssetPDF asset={selectedAsset} qrCodeUrl={pdfQrImageUrl} />
              }
              fileName={`PropertyTag_${selectedAsset.assetId}.pdf`}
            >
              {({ loading }) => (
                <button
                  className={`flex items-center gap-2 rounded-full px-8 py-3 text-lg font-bold text-white shadow-md transition-colors ${
                    loading
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={loading}
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                  {loading ? "Preparing PDF..." : "Download Asset PDF"}
                </button>
              )}
            </PDFDownloadLink>
          ) : null}
        </div>
      </main>
    </div>
  );
}
