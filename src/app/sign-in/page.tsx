"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";
import { Button } from "@/components/ui/Button";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await mockAuth.signIn({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-primary)] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">Dedran</span>
          </Link>
          <Link href="/sign-up" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
            Create account
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col px-4 pt-16 pb-24">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">Welcome back</h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">Sign in to continue your career journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-in-up mt-8 space-y-4" style={{ animationDelay: "80ms" }}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
              placeholder="you@company.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
              placeholder="Your password"
            />
          </label>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-[var(--color-destructive)]/40 bg-[var(--color-destructive)]/10 px-3 py-2 text-sm text-[var(--color-destructive)]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            isLoading={loading}
            className="w-full rounded-full h-12 text-base"
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-center text-xs text-[var(--color-muted-foreground)] pt-2">
            New to Dedran?{" "}
            <Link href="/sign-up" className="font-semibold text-[var(--color-foreground)] hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
