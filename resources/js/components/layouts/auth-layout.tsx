import type React from "react"
import { usePage } from '@inertiajs/react';

interface SharedProps {
  app_name: string;
  // Add other shared props if needed
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
    const { app_name } = usePage().props as unknown as SharedProps;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">{app_name}</h1>
            <p className="text-muted-foreground mt-2">Management System</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
