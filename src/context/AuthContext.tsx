import React, { createContext, useContext, useState } from "react";
import { UserProfile, UserRole } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, role: UserRole, name: string) => void;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MANAGER_USER: UserProfile = {
  id: "u1",
  name: "Shayan Manager",
  email: "shayan@gmail.com",
  role: "manager",
  status: "Active",
};

const STAFF_USER: UserProfile = {
  id: "u2",
  name: "Bilal Staff",
  email: "staff@nowsheramall.pk",
  role: "staff",
  status: "Active",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Manager for quick professional demo, switchable to staff
  const [user, setUser] = useState<UserProfile | null>(MANAGER_USER);

  const login = (email: string, role: UserRole, name: string) => {
    setUser({
      id: `u_${Date.now()}`,
      name: name || (role === "manager" ? "Ahmad Manager" : "Bilal Staff"),
      email,
      role,
      status: "Active",
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchDemoRole = (role: UserRole) => {
    if (role === "manager") setUser(MANAGER_USER);
    else setUser(STAFF_USER);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
