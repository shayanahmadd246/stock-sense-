import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { InventoryProvider, useInventory } from "./context/InventoryContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ToastContainer } from "./components/Toast";
import { AIChatDrawer } from "./components/AIChatDrawer";

import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { ProductDetails } from "./pages/ProductDetails";
import { StockIn } from "./pages/StockIn";
import { StockOut } from "./pages/StockOut";
import { StockHistory } from "./pages/StockHistory";
import { Suppliers } from "./pages/Suppliers";
import { Reports } from "./pages/Reports";
import { AIAssistant } from "./pages/AIAssistant";
import { UsersManagement } from "./pages/UsersManagement";
import { DatabaseInspector } from "./pages/DatabaseInspector";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";

function AppContent() {
  const { user } = useAuth();
  const { activePage, loading } = useInventory();

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <Inventory />;
      case "product-details":
        return <ProductDetails />;
      case "stock-in":
        return <StockIn />;
      case "stock-out":
        return <StockOut />;
      case "stock-history":
        return <StockHistory />;
      case "suppliers":
        return <Suppliers />;
      case "reports":
        return <Reports />;
      case "ai-assistant":
        return <AIAssistant />;
      case "users":
        return <UsersManagement />;
      case "database":
        return <DatabaseInspector />;
      case "settings":
        return <Settings />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900 antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800"></div>
            </div>
          ) : (
            renderPage()
          )}
        </main>
      </div>
      <ToastContainer />
      <AIChatDrawer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <AppContent />
      </InventoryProvider>
    </AuthProvider>
  );
}
