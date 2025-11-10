import { useAuth } from "@/lib/auth-context"
import { router } from "@inertiajs/react"
import { useEffect } from "react"
import type { UserRole } from "@/lib/types"

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: UserRole[]
) {
  const AuthComponent = (props: P) => {
    const { user, isAuthenticated, isLoading } = useAuth()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.visit("/login", { replace: true })
      } else if (
        !isLoading &&
        isAuthenticated &&
        !allowedRoles.includes(user!.role)
      ) {
        router.visit("/dashboard", { replace: true })
      }
    }, [isLoading, isAuthenticated, user])

    if (isLoading || !isAuthenticated || !allowedRoles.includes(user!.role)) {
      return <div>Loading...</div>
    }

    return <WrappedComponent {...props} />
  }

  return AuthComponent
}