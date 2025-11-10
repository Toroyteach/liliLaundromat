import type React from "react"
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">LaundroHub</h1>
            <p className="text-muted-foreground mt-2">Management System</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
