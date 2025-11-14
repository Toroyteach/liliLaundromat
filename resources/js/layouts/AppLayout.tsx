import React from "react";
import { AuthProvider } from "@/lib/auth-context";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {children}
      </div>
    </AuthProvider>
  );
};