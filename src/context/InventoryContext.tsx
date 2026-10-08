import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, StockMovement, Supplier, AuditLog, ReportData } from "../types";
import { fetchProducts, fetchStockHistory, fetchSuppliers, fetchReports, fetchAuditLogs } from "../services/api";
import { useAuth } from "./AuthContext";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface InventoryContextType {
  products: Product[];
  stockHistory: StockMovement[];
  suppliers: Supplier[];
  auditLogs: AuditLog[];
  reports: ReportData | null;
  loading: boolean;
  activePage: string;
  setActivePage: (page: string) => void;
  goBack: () => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  aiUnavailable: boolean;
  setAiUnavailable: (val: boolean) => void;
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stockHistory, setStockHistory] = useState<StockMovement[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [reports, setReports] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePage, setActivePageState] = useState<string>("dashboard");
  const [pageHistory, setPageHistory] = useState<string[]>(["dashboard"]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [aiUnavailable, setAiUnavailable] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setActivePage = (page: string) => {
    if (page !== activePage) {
      setPageHistory((prev) => [...prev, activePage]);
      setActivePageState(page);
    }
  };

  const goBack = () => {
    setPageHistory((prev) => {
      if (prev.length <= 1) {
        setActivePageState("dashboard");
        return ["dashboard"];
      }
      const newHistory = [...prev];
      newHistory.pop(); // remove current
      const previousPage = newHistory[newHistory.length - 1] || "dashboard";
      setActivePageState(previousPage);
      return newHistory;
    });
  };

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const [pData, shData, supData, repData, alData] = await Promise.all([
        fetchProducts(user).catch(() => []),
        fetchStockHistory().catch(() => []),
        fetchSuppliers().catch(() => []),
        fetchReports(user).catch(() => null),
        user?.role === "manager" ? fetchAuditLogs(user).catch(() => []) : Promise.resolve([]),
      ]);
      setProducts(pData || []);
      setStockHistory(shData || []);
      setSuppliers(supData || []);
      setReports(repData);
      setAuditLogs(alData || []);
    } catch (err: any) {
      console.error("Error refreshing data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  return (
    <InventoryContext.Provider
      value={{
        products,
        stockHistory,
        suppliers,
        auditLogs,
        reports,
        loading,
        activePage,
        setActivePage,
        goBack,
        selectedProductId,
        setSelectedProductId,
        aiUnavailable,
        setAiUnavailable,
        toasts,
        addToast,
        removeToast,
        refreshData,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used within an InventoryProvider");
  return context;
}
