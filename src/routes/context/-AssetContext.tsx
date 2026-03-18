import React, {
  createContext,
  type ReactNode,
  use,
  useEffect,
  useState,
} from "react";

// ============================================================================
// 1. ALL TABLE INTERFACES (Mapped from SQL Schemas)
// ============================================================================
export interface Asset {
  assetId: string;
  assetTagDate: string;
  employeeId?: string;
  locationId?: string;
  productId?: string;
  purchaseDate: null | string;
  purchasePrice: null | number | string;
  salvageValue: null | number | string;
  serialNumber: null | string;
  usefulLife: null | number;
  vendorId?: string;
  warrantyDuration: null | number;
  warrantyUnit: null | string;
}
export interface AssetFix {
  assetFixCost: null | number | string;
  assetFixDateEnd: null | string;
  assetFixDateStart: string;
  assetFixDescription: null | string;
  assetFixed: boolean;
  assetFixId: string;
  assetFixTitle: string;
  assetIssueId: string;
  employeeId: string;
}
export interface AssetIssue {
  assetId: string;
  assetIssueDate: string;
  assetIssueDescription: null | string;
  assetIssueId: string;
  assetIssueTitle: string;
  employeeId: string;
}
export interface AssetTransfer {
  assetId: string;
  assetTransferDate: string;
  assetTransferId: string;
  assetTransferPrice: null | number | string;
  companyId: string;
  receivingCompanyId: string;
}
export interface Building {
  buildingAddress: string;
  buildingId: string;
  buildingInsertDate: string;
  buildingName: string;
  companyId: string;
}
export interface Category {
  categoryId: string;
  categoryInsertDate: string;
  categoryName: string;
}
export interface Company {
  companyAddress: string;
  companyCode: string;
  companyId: string;
  companyInsertDate: string;
  companyName: string;
  parentCompanyId: null | string;
}
export interface Department {
  departmentId: string;
  departmentInsertDate: string;
  departmentName: string;
}
export interface Employee {
  companyId: string;
  departmentId: string;
  employeeFullName: string;
  employeeId: string;
  employeeInsertDate: string;
  roleId: string;
}
export interface EndUser {
  employeeId: string;
  endUserId: string;
  endUserName: string;
  endUserRegisterDate: string;
  endUserRoleId: string;
}
export interface Location {
  buildingId: string;
  locationAddress: string;
  locationId: string;
  locationInsertDate: string;
}
export interface Manufacturer {
  manufacturerId: string;
  manufacturerInsertDate: string;
  manufacturerName: string;
}
export interface Product {
  categoryId: string;
  manufacturerId: null | string;
  productId: string;
  productInsertDate: string;
  productModelNumber: null | string;
  productName: null | string;
}
export interface ProductSet {
  parentProductId: string;
  productId: string;
  productSetInsertDate: string;
}
export interface Role {
  roleId: string;
  roleInsertDate: string;
  roleName: string;
}
export interface Vendor {
  vendorAddress: string;
  vendorId: string;
  vendorInsertDate: string;
  vendorName: string;
}

// ============================================================================
// 2. MOCK DATA DICTIONARY
// ============================================================================
const defaultDbState: Record<string, any[]> = {
  Asset: [
    {
      assetId: "AST-1001",
      assetTagDate: "01/29/2026",
      purchaseDate: "01/20/2026",
      purchasePrice: "20000",
      serialNumber: "SN-9F3K",
      warrantyDuration: 12,
      warrantyUnit: "mm",
    },
    {
      assetId: "AST-1002",
      assetTagDate: "01/22/2026",
      purchaseDate: "01/20/2026",
      purchasePrice: "70000",
      serialNumber: "AS-4Q7M",
      warrantyDuration: 5,
      warrantyUnit: "yy",
    },
  ],
  AssetFix: [
    {
      assetFixCost: "4500",
      assetFixDateEnd: "03/11/2026",
      assetFixDateStart: "03/10/2026",
      assetFixDescription: "Swapped out cracked LCD.",
      assetFixed: true,
      assetFixId: "FIX-001A",
      assetFixTitle: "Replaced Broken Screen",
      assetIssueId: "ISS-992B",
      employeeId: "EMP-102",
    },
  ],
  AssetIssue: [
    {
      assetId: "AST-1001",
      assetIssueDate: "03/09/2026",
      assetIssueDescription: "Secondary display flickers.",
      assetIssueId: "ISS-104A",
      assetIssueTitle: "Monitor Flickering",
      employeeId: "EMP-214",
    },
  ],
  AssetTransfer: [
    {
      assetId: "AST-1002",
      assetTransferDate: "03/01/2026",
      assetTransferId: "TRF-9001A",
      assetTransferPrice: "0",
      companyId: "CMP-001",
      receivingCompanyId: "CMP-002",
    },
  ],
  Building: [
    {
      buildingAddress: "123 Nepo Center, Angeles City",
      buildingId: "BLD-5001",
      buildingInsertDate: "01/15/2026",
      buildingName: "Entec 1",
      companyId: "CMP-001",
    },
  ],
  Category: [
    {
      categoryId: "CAT-1001",
      categoryInsertDate: "01/10/2026",
      categoryName: "Electronics & IT Equipment",
    },
    {
      categoryId: "CAT-1002",
      categoryInsertDate: "01/12/2026",
      categoryName: "Office Furniture",
    },
  ],
  Company: [
    {
      companyAddress: "Nepo Center, Angeles",
      companyCode: "NRG",
      companyId: "CMP-001",
      companyInsertDate: "01/01/2020",
      companyName: "Nepomuceno Realty Group",
      parentCompanyId: null,
    },
  ],
  Department: [
    {
      departmentId: "DEPT-1001",
      departmentInsertDate: "01/10/2026",
      departmentName: "Information Technology",
    },
  ],
  EndUser: [
    {
      employeeId: "EMP-045",
      endUserId: "USR-A101",
      endUserName: "jdelacruz",
      endUserRegisterDate: "01/15/2026",
      endUserRoleId: "ROLE-1001",
    },
  ],
  Location: [
    {
      buildingId: "BLD-5001",
      locationAddress: "2nd Floor, Server Room Alpha",
      locationId: "LOC-001A",
      locationInsertDate: "01/15/2026",
    },
  ],
  Manufacturer: [
    {
      manufacturerId: "MFG-8001",
      manufacturerInsertDate: "01/10/2026",
      manufacturerName: "Dell Technologies",
    },
  ],
  Product: [
    {
      categoryId: "CAT-1001",
      manufacturerId: "MFG-8001",
      productId: "PRD-1001",
      productInsertDate: "01/15/2026",
      productModelNumber: "L7420-vPro",
      productName: "Latitude 7420",
    },
  ],
  ProductSet: [
    {
      parentProductId: "PRD-WS-9000",
      productId: "PRD-MON-24",
      productSetInsertDate: "02/01/2026",
    },
  ],
  Role: [
    {
      roleId: "ROLE-1001",
      roleInsertDate: "01/10/2026",
      roleName: "System Administrator",
    },
  ],
  Vendor: [
    {
      vendorAddress: "123 Silicon Way, Makati City",
      vendorId: "VND-1001",
      vendorInsertDate: "01/10/2026",
      vendorName: "TechSource Solutions",
    },
  ],
};

// ============================================================================
// 3. CONTEXT DEFINITION
// ============================================================================
interface DatabaseContextType {
  addRecord: (tableName: string, newRecord: any) => void;
  // Expose the raw DB state in case you need it
  db: Record<string, any[]>;
  // Generic Database Methods
  getTableData: (tableName: string) => any[];

  updateRecord: (
    tableName: string,
    idKey: string,
    idValue: string,
    updatedData: any,
  ) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  // 1. Initialize State from LocalStorage OR Default Data
  const [db, setDb] = useState<Record<string, any[]>>(() => {
    const savedDb = localStorage.getItem("appDatabase");
    if (savedDb) {
      return JSON.parse(savedDb);
    }
    return defaultDbState;
  });

  // 2. Auto-Save to LocalStorage on any change
  useEffect(() => {
    localStorage.setItem("appDatabase", JSON.stringify(db));
  }, [db]);

  // 3. Generic GET
  const getTableData = (tableName: string) => {
    return db[tableName] || [];
  };

  // 4. Generic ADD
  const addRecord = (tableName: string, newRecord: any) => {
    setDb((prevDb) => ({
      ...prevDb,
      [tableName]: [...(prevDb[tableName] || []), newRecord],
    }));
  };

  // 5. Generic UPDATE
  // We need to know the 'idKey' (e.g., 'assetId', 'companyId') to find the exact row
  const updateRecord = (
    tableName: string,
    idKey: string,
    idValue: string,
    updatedData: any,
  ) => {
    setDb((prevDb) => {
      const tableData = prevDb[tableName] || [];
      const updatedTableData = tableData.map((row) =>
        row[idKey] === idValue ? { ...row, ...updatedData } : row,
      );
      return {
        ...prevDb,
        [tableName]: updatedTableData,
      };
    });
  };

  return (
    <DatabaseContext value={{ addRecord, db, getTableData, updateRecord }}>
      {children}
    </DatabaseContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDatabase() {
  const context = use(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
