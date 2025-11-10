import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { User, AuthContextType, UserRole } from "./types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true)
    setError(null)
    try {
      // Mock authentication - in production, validate against backend
      // Demo credentials: admin@laundromart.com, manager@laundromart.com, staff@laundromart.com, customer@laundromart.com
      let userRole: UserRole = "customer"

      if (email.includes("admin")) userRole = "admin"
      else if (email.includes("manager")) userRole = "manager"
      else if (email.includes("staff")) userRole = "staff"
      else userRole = role || "customer"

      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name: email.split("@")[0],
        role: userRole,
        createdAt: new Date(),
      }
      setUser(mockUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        role: "customer",
        createdAt: new Date(),
      }
      setUser(mockUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      setUser(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
