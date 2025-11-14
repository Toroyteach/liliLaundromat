import { Link, useForm } from "@inertiajs/react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    email: "",
    password: "",
    password_confirmation: "",
    token: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/reset-password", {
      onSuccess: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <AuthLayout>
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
            disabled={processing}
          />
          {(errors.email || errors.error) && (
            <p className="mt-1 text-sm text-destructive">
              {errors.email || errors.error}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            New Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            required
            disabled={processing}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={data.password_confirmation}
            onChange={(e) => setData("password_confirmation", e.target.value)}
            required
            disabled={processing}
          />
          {errors.password_confirmation && (
            <p className="mt-1 text-sm text-destructive">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        {recentlySuccessful && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-lg text-sm text-green-700">
            Your password has been successfully reset. You can now sign in.
          </div>
        )}

        {(errors.email || errors.password || errors.error) && !recentlySuccessful && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">
              {errors.email || errors.password || errors.error}
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={processing}
        >
          {processing ? "Resetting..." : "Reset Password"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Remember your password? </span>
          <Link
            href="/sign-in"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}