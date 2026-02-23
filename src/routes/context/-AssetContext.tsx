import React, { createContext, type ReactNode, use, useState } from "react";

// 1. Define your Asset type
export interface Asset {
  assetId: string;
  assetTagDate: string;
  purchaseDate: string;
  purchasePrice: string;
  serialNumber: string;
  warrantyDuration: number;
  warrantyUnit: string;
}

// 2. Define what the Context holds
interface AssetContextType {
  addAsset: (newAsset: Asset) => void;
  assets: Asset[];
  updateAsset: (id: string, updatedData: Partial<Asset>) => void;
}

const defaultData: Asset[] = [
  {
    assetId: "0001",
    assetTagDate: "1/29/2026",
    purchaseDate: "1/20/2026",
    purchasePrice: "₱20000",
    serialNumber: "SN-9F3K",
    warrantyDuration: 10,
    warrantyUnit: "mm",
  },
  {
    assetId: "0002",
    assetTagDate: "1/22/2026",
    purchaseDate: "1/20/2026",
    purchasePrice: "₱70000",
    serialNumber: "AS-4Q7M",
    warrantyDuration: 5,
    warrantyUnit: "yy",
  },
];

// 3. Create the Context
const AssetContext = createContext<AssetContextType | undefined>(undefined);

// 4. Create the Provider Component
export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(defaultData);

  const updateAsset = (id: string, updatedData: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.assetId === id ? { ...asset, ...updatedData } : asset,
      ),
    );
  };

  const addAsset = (newAsset: Asset) => {
    setAssets((prev) => [...prev, newAsset]);
  };

  return (
    <AssetContext value={{ addAsset, assets, updateAsset }}>
      {children}
    </AssetContext>
  );
}

// 5. Custom Hook for easy usage
// eslint-disable-next-line react-refresh/only-export-components
export function useAssetContext() {
  const context = use(AssetContext);
  if (!context) {
    throw new Error("useAssetContext must be used within an AssetProvider");
  }
  return context;
}
