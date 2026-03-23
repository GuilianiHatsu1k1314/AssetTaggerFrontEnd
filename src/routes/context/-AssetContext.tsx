import React, {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

// ============================================================================
// 1. ALL TABLE INTERFACES (Keep your existing interfaces here!)
// ============================================================================
// ... (Keep all your export interfaces like Asset, Building, EndUser, etc.) ...

// ============================================================================
// 2. CONTEXT DEFINITION & API LOGIC
// ============================================================================
const API_BASE_URL = "http://localhost:3000/api";

interface DatabaseContextType {
  addRecord: (tableName: string, newRecord: any) => Promise<void>;
  currentUser: any | null; // NEW: Expose the logged-in user
  db: Record<string, any[]>;
  getTableData: (tableName: string) => any[];
  isLoading: boolean;
  loginUser: (EndUserName: string, EndUserPassword: string) => Promise<boolean>;
  logoutUser: () => Promise<void>; // Removed the requirement to pass ID manually
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

  // NEW: Initialize user state from localStorage so it survives page refreshes
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // NEW: Wrapped the fetch logic in a useCallback so we can trigger it manually
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
            const route = table.toLowerCase();
            const response = await fetch(`${API_BASE_URL}/${route}`, {
              credentials: "include",
              method: "GET",
            });

            if (response.ok) {
              fetchedData[table] = await response.json();
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

  // NEW: Only fetch data automatically if a user is already logged in
  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    } else {
      setIsLoading(false);
    }
  }, [currentUser, fetchAllData]);

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

      // 1. Get the user data from the backend response
      let userData = await response.json();

      // (If your API returns an array like [ { endUserId: "..." } ], grab the first item)
      if (Array.isArray(userData)) userData = userData[0];

      // 2. Save it to state and localStorage
      setCurrentUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // 3. Immediately trigger the data fetch so the dashboard populates!
      fetchAllData();

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      // Use the ID from state if it exists
      const endUserId = currentUser?.endUserId || currentUser?.EndUserID || "";

      await fetch(`${API_BASE_URL}/authentication/${endUserId}`, {
        credentials: "include",
        method: "DELETE",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clean up the frontend regardless of whether the backend delete succeeded
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
  const addRecord = async (tableName: string, newRecord: any) => {
    const route = tableName.toLowerCase();
    try {
      const response = await fetch(`${API_BASE_URL}/${route}`, {
        body: JSON.stringify(newRecord),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) throw new Error(`Failed to add record to ${tableName}`);

      let savedRecord = await response.json();
      if (Array.isArray(savedRecord)) savedRecord = savedRecord[0];

      setDb((prevDb) => ({
        ...prevDb,
        [tableName]: [...(prevDb[tableName] || []), savedRecord],
      }));
    } catch (error) {
      console.error(`Error adding to ${tableName}:`, error);
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
    const route = tableName.toLowerCase();
    try {
      const response = await fetch(`${API_BASE_URL}/${route}/${idValue}`, {
        body: JSON.stringify(updatedData),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!response.ok) throw new Error(`Failed to update ${tableName}`);

      setDb((prevDb) => {
        const tableData = prevDb[tableName] || [];
        const updatedTableData = tableData.map((row) =>
          String(row[idKey]) === String(idValue)
            ? { ...row, ...updatedData }
            : row,
        );
        return {
          ...prevDb,
          [tableName]: updatedTableData,
        };
      });
    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw error;
    }
  };

  return (
    <DatabaseContext
      value={{
        addRecord,
        currentUser, // NEW: Passed down to the rest of the app!
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
