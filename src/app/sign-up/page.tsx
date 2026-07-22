"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { mockAuth } from "@/lib/mock-auth";
import { Button } from "@/components/ui/Button";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => {
    const checks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    };
    const passed = Object.values(checks).filter(Boolean).length;
    return { checks, passed };
  }, [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await mockAuth.signUp({ name, email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account.");
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
          <Link href="/sign-in" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col px-4 pt-16 pb-24">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">Create your account</h1>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Join Dedran and start shipping your career. Free forever.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-in-up mt-8 space-y-4" style={{ animationDelay: "80ms" }}>
          <Field label="Full name">
            <input
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
              placeholder="Alex Rivera"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
              placeholder="you@company.com"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
              placeholder="At least 8 characters"
            />
            {password && (
              <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-background)] border border-[var(--color-border)]/50">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(strength.passed / 5) * 100}%`,
                        background:
                          strength.passed <= 2
                            ? "#ef4444" // red
                            : strength.passed <= 3
                              ? "#eab308" // yellow
                              : "#10b981", // green
                      }}
                    />
                  </div>
                  <span className="text-xs text-[var(--color-muted-foreground)]">{strength.passed}/5</span>
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-1 text-xs">
                  <Check ok={strength.checks.length}>8+ characters</Check>
                  <Check ok={strength.checks.upper}>Uppercase</Check>
                  <Check ok={strength.checks.lower}>Lowercase</Check>
                  <Check ok={strength.checks.number}>Number</Check>
                  <Check ok={strength.checks.symbol}>Symbol</Check>
                </ul>
              </div>
            )}
          </Field>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-[var(--color-destructive)]/40 bg-[var(--color-destructive)]/10 px-3 py-2 text-sm text-[var(--color-destructive)]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            isLoading={loading}
            className="w-full rounded-full h-12 text-base mt-2"
          >
            {loading ? "Creating account…" : "Create account"}
          </Button>

          <p className="text-center text-xs text-[var(--color-muted-foreground)] pt-2">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-[var(--color-foreground)] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">{label}</span>
      {children}
    </label>
  );
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li
      className={`flex items-center gap-1.5 ${
        ok ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"
      }`}
    >
      <CheckCircle2
        className={`h-3.5 w-3.5 ${ok ? "text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]/40"}`}
      />
      {children}
    </li>
  );
}
