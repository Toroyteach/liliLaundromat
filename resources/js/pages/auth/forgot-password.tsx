import { Link, useForm } from "@inertiajs/react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/forgot-password", {
      onSuccess: () => reset(),
    });
  };

  return (
    <AuthLayout>
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {recentlySuccessful && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-lg text-sm text-green-700">
            Password reset link has been sent to your email.
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={processing}
        >
          {processing ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthLayout>
  );
}