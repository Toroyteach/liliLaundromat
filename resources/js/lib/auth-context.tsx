import React, { createContext, useContext, useMemo } from "react";
import { usePage } from "@inertiajs/react";

// -------------------- TYPES --------------------
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
  profile_photo_path?: string | null;
}

export interface AuthData {
  user: AuthUser | null;
  permissions: string[];
  primaryRole: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  permissions: string[];
  primaryRole: string;
  isAuthenticated: boolean;
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

// -------------------- CONTEXT --------------------
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// -------------------- PROVIDER --------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { props } = usePage<{ auth: AuthData }>();
  const auth = props.auth;

  const value = useMemo<AuthContextValue>(() => {
    const user = auth?.user ?? null;
    const permissions = auth?.permissions ?? [];
    const primaryRole = auth?.primaryRole ?? "";

    return {
      user,
      permissions,
      primaryRole,
      isAuthenticated: !!user,
      can: (permission: string) => permissions.includes(permission),
      hasRole: (role: string) => primaryRole === role,
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// -------------------- HOOK --------------------
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};