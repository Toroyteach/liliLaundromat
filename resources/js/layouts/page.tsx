import { useEffect } from "react"
import { router } from '@inertiajs/react'
import { useAuth } from "@/lib/auth-context"
import { AnimatedLanding } from "@/components/animated-landing"

export default function Home() {
  const { isAuthenticated} = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.visit('/dashboard')
    }
  }, [isAuthenticated, router])

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">Loading...</p>
  //       </div>
  //     </div>
  //   )
  // }

  if (!isAuthenticated) {
    return <AnimatedLanding />
  }

  return null
}
