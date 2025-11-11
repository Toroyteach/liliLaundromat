// --- Complete2FAChallengePage.tsx ---
import type React from "react";
import { useState } from "react";
import { router, Link } from "@inertiajs/react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";

export default function SignInWith2FA() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await router.post("/two-factor-challenge", { code });
      router.visit("/dashboard");
    } catch {
      setError("Invalid 2FA code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center text-center mb-4">
          <ShieldCheck className="w-10 h-10 text-primary mb-2" />
          <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Authentication Code
          </label>
          <Input
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Lost access to your device? </span>
          <Link href="/recover-account" className="text-primary hover:underline font-medium">
            Recover Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}