"use client"

import type React from "react"

import { useState } from "react"
import { router, Link } from '@inertiajs/react' // replace next imports
import { AuthLayout } from "@/components/layouts/auth-layout"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState("")
  const { signup, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)
    try {
      await signup(email, password, name)
      router.visit('/dashboard')
    } catch (err) {
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {(error || validationError) && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">{error || validationError}</p>
          </div>
        )}

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
