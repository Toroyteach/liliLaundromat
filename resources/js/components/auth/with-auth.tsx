import { useAuth } from "@/lib/auth-context";
import { router } from '@inertiajs/react'
import { useEffect } from "react";
import type { UserRole } from "@/lib/types";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: UserRole[]
) {
  const AuthComponent = (props: P) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.visit("/login");
      } else if (
        !isLoading &&
        isAuthenticated &&
        !allowedRoles.includes(user!.role)
      ) {
        // Redirect to a more appropriate page, like their dashboard
        router.visit('/dashboard');
      }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading || !isAuthenticated || !allowedRoles.includes(user!.role)) {
      return <div>Loading...</div>; // Or a proper loading skeleton
    }

    return <WrappedComponent {...props} />;
  };
  return AuthComponent;
}
