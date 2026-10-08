export function safeNum(val: any, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) || !isFinite(n) ? fallback : n;
}

export type UserRole = "manager" | "staff";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStock: number;
  sellingPrice: number;
  costPrice?: number;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export interface StockMovement {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  movementType: "Stock In" | "Stock Out" | "Damaged" | "Adjustment";
  quantity: number;
  previousStock: number;
  newStock: number;
  user: string;
  supplier?: string;
  reason?: string;
  source: "Normal Form" | "AI";
  confirmed: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  suppliedProductsCount: number;
  status: "Active" | "Inactive";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  productName: string;
  previousValue: string;
  newValue: string;
  source: "Normal Form" | "AI";
  confirmed: boolean;
}

export interface ReportData {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  damagedItems: number;
  inventoryValue?: number;
  totalSales?: number;
  profit?: number;
  weeklySales: number[];
  topSelling: Product[];
  lowStockList: Product[];
}

export interface AIChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  proposal?: AIStockProposal | null;
}

export interface AIStockProposal {
  action: string;
  productName: string;
  productId?: string;
  quantity: number;
  supplier?: string;
  currentStock: number;
  newStock: number;
}
