"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/portal";

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message || "Invalid credentials");
      } else {
        router.push(redirect);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signUp.email({ email, password, name });
      if (result.error) {
        setError(result.error.message || "Could not create account");
      } else {
        router.push(redirect);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl tracking-wide">
            Ceardaí
          </Link>
          <div className="w-12 h-px bg-amber mx-auto mt-4 mb-6"></div>
          <p className="text-charcoal/60 text-sm">
            Sign in to access your account and place orders.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-charcoal/10 mb-8">
          <button
            onClick={() => { setTab("signin"); setError(""); }}
            className={`flex-1 pb-3 text-sm uppercase tracking-widest transition-colors ${
              tab === "signin"
                ? "text-charcoal border-b-2 border-amber"
                : "text-charcoal/40 hover:text-charcoal/60"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab("signup"); setError(""); }}
            className={`flex-1 pb-3 text-sm uppercase tracking-widest transition-colors ${
              tab === "signup"
                ? "text-charcoal border-b-2 border-amber"
                : "text-charcoal/40 hover:text-charcoal/60"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 bg-burgundy/10 text-burgundy text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label
                htmlFor="signin-email"
                className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="signin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="signin-password"
                className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="signin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-cream px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {tab === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="signup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="signup-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
              <p className="text-xs text-charcoal/40 mt-1">Minimum 8 characters</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-cream px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm text-charcoal/40 hover:text-amber transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
