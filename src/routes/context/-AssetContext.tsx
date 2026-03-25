import React, {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

// ============================================================================
// HELPER FUNCTIONS: Bridge the gap between Frontend (camelCase) & Backend (PascalCase)
// ============================================================================
const toCamelCase = (str: string) => {
  const camel = str.charAt(0).toLowerCase() + str.slice(1);
  // Ensure SQL's "ID" and "URL" become frontend's "Id" and "Url"
  return camel.replace(/ID$/, "Id").replace(/URL$/, "Url");
};

const toPascalCase = (str: string) => {
  const pascal = str.charAt(0).toUpperCase() + str.slice(1);
  // Ensure frontend's "Id" and "Url" become SQL's "ID" and "URL"
  return pascal.replace(/Id$/, "ID").replace(/Url$/, "URL");
};

const formatKeysToCamelCase = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(formatKeysToCamelCase);

  const newObj: Record<string, any> = {};
  for (const key in obj) {
    newObj[toCamelCase(key)] = obj[key];
  }
  return newObj;
};

const formatKeysToPascalCase = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(formatKeysToPascalCase);

  const newObj: Record<string, any> = {};
  for (const key in obj) {
    newObj[toPascalCase(key)] = obj[key];
  }
  return newObj;
};

// ============================================================================
// 1. ALL TABLE INTERFACES
// ============================================================================
// ... (Keep your other export interfaces like Asset, Building, EndUser here) ...

// NEW: EndUserRole Interface
export interface EndUserRole {
  // This index signature allows TypeScript to accept the 64+ dynamic boolean permission fields
  // (like createAsset, readBuilding, etc.) without having to type them all out manually!
  [key: string]: any;
  endUserRoleCreationDate: null | string;
  endUserRoleId: string;
  endUserRoleName: string;
}

// ============================================================================
// 2. CONTEXT DEFINITION & API LOGIC
// ============================================================================
// const API_BASE_URL = "http://localhost:3000/api";
const API_BASE_URL = "https://192.168.200.171:3000/api";
// const API_BASE_URL = "http://192.168.200.179:3000/api";

interface DatabaseContextType {
  addRecord: (tableName: string, newRecord: any) => Promise<void>;
  currentUser: any | null;
  db: Record<string, any[]>;
  getTableData: (tableName: string) => any[];
  isLoading: boolean;
  loginUser: (EndUserName: string, EndUserPassword: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  updateRecord: (
    tableName: string,
    idKey: string,
    idValue: string,
    updatedData: any,
  ) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const tables = [
        "Asset",
        "AssetFix",
        "AssetIssue",
        "AssetTransfer",
        "Building",
        "Category",
        "Company",
        "Department",
        "Employee",
        "EndUser",
        "EndUserRole", // Already here, perfect!
        "Location",
        "Manufacturer",
        "Product",
        "ProductSet",
        "Role",
        "Vendor",
      ];

      const fetchedData: Record<string, any[]> = {};

      await Promise.all(
        tables.map(async (table) => {
          try {
            const response = await fetch(`${API_BASE_URL}/${table}`, {
              credentials: "include",
              method: "GET",
            });

            if (response.ok) {
              const rawData = await response.json();
              fetchedData[table] = formatKeysToCamelCase(rawData);
            } else {
              fetchedData[table] = [];
            }
          } catch (err) {
            console.error(`Failed to fetch ${table}:`, err);
            fetchedData[table] = [];
          }
        }),
      );

      setDb(fetchedData);
    } catch (error) {
      console.error("Global Database Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    } else {
      setIsLoading(false);
    }
  }, [currentUser, fetchAllData]);
  // });

  // 1. AUTHENTICATION LOGIC
  const loginUser = async (EndUserName: string, EndUserPassword: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/authentication`, {
        body: JSON.stringify({ EndUserName, EndUserPassword }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      let userData = await response.json();
      if (Array.isArray(userData)) userData = userData[0];

      const formattedUser = formatKeysToCamelCase(userData);

      // Admin Override for testing
      if (EndUserName.toLowerCase() === "admin") {
        formattedUser.roleName = "Admin";
      } else {
        formattedUser.roleName = "User";
      }

      setCurrentUser(formattedUser);
      localStorage.setItem("currentUser", JSON.stringify(formattedUser));

      fetchAllData();
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      const endUserId = currentUser?.endUserId || currentUser?.EndUserID || "";

      await fetch(`${API_BASE_URL}/authentication/${endUserId}`, {
        credentials: "include",
        method: "DELETE",
      });

      fetchAllData();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      setDb({});
    }
  };

  // 3. GENERIC GET
  const getTableData = (tableName: string) => {
    return db[tableName] || [];
  };

  // 4. GENERIC ADD (POST)
  const addRecord = async (tableName: string, data: any) => {
    try {
      const payload = formatKeysToPascalCase(data);

      const response = await fetch(`${API_BASE_URL}/${tableName}`, {
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save record.");
      }

      const rawNewRecord = await response.json();
      const formattedNewRecord = formatKeysToCamelCase(rawNewRecord);

      setDb((prevDb) => {
        const tableData = prevDb[tableName] || [];
        return {
          ...prevDb,
          [tableName]: [...tableData, formattedNewRecord],
        };
      });

      fetchAllData();
    } catch (error) {
      console.error(`Error adding record to ${tableName}:`, error);
      throw error;
    }
  };

  // 5. GENERIC UPDATE (PATCH)
  const updateRecord = async (
    tableName: string,
    idKey: string,
    idValue: string,
    updatedData: any,
  ) => {
    try {
      const payload = formatKeysToPascalCase(updatedData);

      const response = await fetch(`${API_BASE_URL}/${tableName}/${idValue}`, {
        body: JSON.stringify(payload),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!response.ok) throw new Error(`Failed to update ${tableName}`);

      const rawUpdatedRecord = await response.json();
      const formattedUpdatedRecord = formatKeysToCamelCase(rawUpdatedRecord);

      setDb((prevDb) => {
        const tableData = prevDb[tableName] || [];
        const updatedTableData = tableData.map((row) =>
          String(row[idKey]) === String(idValue)
            ? { ...row, ...formattedUpdatedRecord }
            : row,
        );
        return {
          ...prevDb,
          [tableName]: updatedTableData,
        };
      });

      fetchAllData();
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw error;
    }
  };

  return (
    <DatabaseContext
      value={{
        addRecord,
        currentUser,
        db,
        getTableData,
        isLoading,
        loginUser,
        logoutUser,
        updateRecord,
      }}
    >
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
