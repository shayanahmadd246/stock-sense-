import { Product, StockMovement, Supplier, AuditLog, ReportData, UserProfile } from "../types";
import { supabase } from "./supabaseClient";

export { supabase };

// Helper for headers with role & user name
function getHeaders(user: UserProfile | null) {
  return {
    "Content-Type": "application/json",
    "x-user-role": user?.role || "manager",
    "x-user-name": user?.name || "Ahmad Manager",
  };
}

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      console.log("Supabase connection status:", error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function fetchProducts(user: UserProfile | null): Promise<Product[]> {
  try {
    // Try Supabase first if tables exist
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data && data.length > 0) {
      const mapped = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        sku: p.sku,
        currentStock: p.current_stock ?? p.currentStock,
        minStock: p.min_stock ?? p.minStock,
        sellingPrice: p.selling_price ?? p.sellingPrice,
        costPrice: p.cost_price ?? p.costPrice,
        supplier: p.supplier,
        status: p.status,
      }));
      if (user?.role === "staff") {
        return mapped.map((p: any) => {
          const { costPrice, ...rest } = p;
          return rest;
        });
      }
      return mapped;
    }
  } catch (e) {
    console.warn("Supabase fetch fallback to backend API:", e);
  }

  // Fallback to Express backend API (SQLite)
  try {
    const res = await fetch("/api/products", {
      headers: getHeaders(user),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchProductDetails(id: string, user: UserProfile | null): Promise<{ product: Product; movements: StockMovement[] }> {
  try {
    const { data: prodData, error: prodErr } = await supabase.from('products').select('*').eq('id', id).single();
    const { data: movData, error: movErr } = await supabase.from('stock_movements').select('*').eq('product_id', id).order('timestamp', { ascending: false });

    if (!prodErr && prodData) {
      const product: Product = {
        id: prodData.id,
        name: prodData.name,
        category: prodData.category,
        sku: prodData.sku,
        currentStock: prodData.current_stock ?? prodData.currentStock,
        minStock: prodData.min_stock ?? prodData.minStock,
        sellingPrice: prodData.selling_price ?? prodData.sellingPrice,
        costPrice: prodData.cost_price ?? prodData.costPrice,
        supplier: prodData.supplier,
        status: prodData.status,
      };

      const movements: StockMovement[] = (movData || []).map((m: any) => ({
        id: m.id,
        timestamp: m.timestamp,
        productId: m.product_id ?? m.productId,
        productName: m.product_name ?? m.productName,
        movementType: m.movement_type ?? m.movementType,
        quantity: m.quantity,
        previousStock: m.previous_stock ?? m.previousStock,
        newStock: m.new_stock ?? m.newStock,
        user: m.user,
        supplier: m.supplier,
        reason: m.reason,
        source: m.source,
        confirmed: m.confirmed,
      }));

      if (user?.role === "staff") {
        const { costPrice, ...rest } = product;
        return { product: rest, movements };
      }
      return { product, movements };
    }
  } catch (e) {
    console.warn("Supabase details fallback to backend API:", e);
  }

  const res = await fetch(`/api/products/${id}`, {
    headers: getHeaders(user),
  });
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
}

export async function addProductApi(data: Partial<Product>, user: UserProfile | null): Promise<Product> {
  try {
    const newId = `p_${Date.now()}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const payload = {
      id: newId,
      name: data.name,
      category: data.category,
      sku: data.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      current_stock: data.currentStock || 0,
      min_stock: data.minStock || 5,
      selling_price: data.sellingPrice || 0,
      cost_price: data.costPrice || 0,
      supplier: data.supplier || "Ali Traders",
      created_at: now,
      updated_at: now,
      status: (data.currentStock || 0) <= 0 ? "Out of Stock" : (data.currentStock || 0) <= (data.minStock || 5) ? "Low Stock" : "In Stock"
    };

    const { data: inserted, error } = await supabase.from('products').insert([payload]).select().single();
    if (!error && inserted) {
      return {
        id: inserted.id,
        name: inserted.name,
        category: inserted.category,
        sku: inserted.sku,
        currentStock: inserted.current_stock ?? inserted.currentStock,
        minStock: inserted.min_stock ?? inserted.minStock,
        sellingPrice: inserted.selling_price ?? inserted.sellingPrice,
        costPrice: inserted.cost_price ?? inserted.costPrice,
        supplier: inserted.supplier,
        status: inserted.status,
      };
    }
  } catch (e) {
    console.warn("Supabase add product fallback to backend:", e);
  }

  const res = await fetch("/api/products", {
    method: "POST",
    headers: getHeaders(user),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to add product");
  }
  return json;
}

export async function fetchStockHistory(): Promise<StockMovement[]> {
  try {
    const { data, error } = await supabase.from('stock_movements').select('*').order('timestamp', { ascending: false });
    if (!error && data) {
      return data.map((m: any) => ({
        id: m.id,
        timestamp: m.timestamp,
        productId: m.product_id ?? m.productId,
        productName: m.product_name ?? m.productName,
        movementType: m.movement_type ?? m.movementType,
        quantity: m.quantity,
        previousStock: m.previous_stock ?? m.previousStock,
        newStock: m.new_stock ?? m.newStock,
        user: m.user,
        supplier: m.supplier,
        reason: m.reason,
        source: m.source,
        confirmed: m.confirmed,
      }));
    }
  } catch (e) {
    console.warn("Supabase history fallback:", e);
  }

  try {
    const res = await fetch("/api/stock/history");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function recordStockIn(data: { productId: string; quantity: number; supplier?: string; reference?: string; notes?: string }, user: UserProfile | null) {
  const res = await fetch("/api/stock/in", {
    method: "POST",
    headers: getHeaders(user),
    body: JSON.stringify({ ...data, userName: user?.name || "Staff User" }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to record stock in");
  return json;
}

export async function recordStockOut(data: { productId: string; quantity: number; reason: string; notes?: string }, user: UserProfile | null) {
  const res = await fetch("/api/stock/out", {
    method: "POST",
    headers: getHeaders(user),
    body: JSON.stringify({ ...data, userName: user?.name || "Staff User" }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to record stock out");
  return json;
}

export async function fetchSuppliers(): Promise<Supplier[]> {
  try {
    const { data, error } = await supabase.from('suppliers').select('*');
    if (!error && data) {
      return data.map((s: any) => ({
        id: s.id,
        name: s.name,
        contact: s.contact,
        email: s.email,
        suppliedProductsCount: s.supplied_products_count ?? s.suppliedProductsCount,
        status: s.status,
      }));
    }
  } catch (e) {
    console.warn("Supabase suppliers fallback:", e);
  }

  try {
    const res = await fetch("/api/suppliers");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function addSupplierApi(data: Partial<Supplier>, user: UserProfile | null): Promise<Supplier> {
  const res = await fetch("/api/suppliers", {
    method: "POST",
    headers: getHeaders(user),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to add supplier");
  return json;
}

export async function fetchReports(user: UserProfile | null): Promise<ReportData> {
  const res = await fetch("/api/reports", {
    headers: getHeaders(user),
  });
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

export async function fetchAuditLogs(user: UserProfile | null): Promise<AuditLog[]> {
  try {
    const { data, error } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false });
    if (!error && data) {
      return data.map((a: any) => ({
        id: a.id,
        timestamp: a.timestamp,
        user: a.user,
        action: a.action,
        productName: a.product_name ?? a.productName,
        previousValue: a.previous_value ?? a.previousValue,
        newValue: a.new_value ?? a.newValue,
        source: a.source,
        confirmed: a.confirmed,
      }));
    }
  } catch (e) {
    console.warn("Supabase audit logs fallback:", e);
  }

  const res = await fetch("/api/audit-logs", {
    headers: getHeaders(user),
  });
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}

export async function fetchUsers(user: UserProfile | null): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (!error && data) {
      return data.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
      }));
    }
  } catch (e) {
    console.warn("Supabase users fallback:", e);
  }

  try {
    const res = await fetch("/api/users", {
      headers: getHeaders(user),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function addUserApi(data: Partial<UserProfile>, user: UserProfile | null): Promise<UserProfile> {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: getHeaders(user),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to add user");
  return json;
}

export async function updateUserApi(id: string, data: Partial<UserProfile>, user: UserProfile | null): Promise<UserProfile> {
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: getHeaders(user),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to update user");
  return json;
}

export async function deleteUserApi(id: string, user: UserProfile | null): Promise<any> {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(user),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to delete user");
  return json;
}

export async function fetchDatabaseInspection(user: UserProfile | null) {
  const res = await fetch("/api/database/inspect", {
    headers: getHeaders(user),
  });
  if (!res.ok) throw new Error("Failed to inspect database");
  return await res.json();
}

export async function sendAIChatApi(message: string, user: UserProfile | null, aiUnavailable: boolean = false) {
  if (aiUnavailable) {
    throw new Error("AI Assistant is temporarily unavailable. Normal inventory features still work.");
  }
  if (!message || typeof message !== "string") {
    throw new Error("Invalid message format");
  }
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: getHeaders(user),
      body: JSON.stringify({ message, role: user?.role || "manager", userName: user?.name || "Ahmad Manager" }),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("AI Assistant is temporarily unavailable. Normal inventory features still work.");
    }

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "AI Assistant is temporarily unavailable. Normal inventory features still work.");
    }
    return json; // { reply, proposal }
  } catch (err: any) {
    throw new Error("AI Assistant is temporarily unavailable. Normal inventory features still work.");
  }
}

export async function confirmAIChangeApi(proposal: any, user: UserProfile | null) {
  const res = await fetch("/api/ai/confirm-change", {
    method: "POST",
    headers: getHeaders(user),
    body: JSON.stringify({ proposal, userName: user?.name || "Ahmad Manager" }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to confirm AI change");
  return json;
}
