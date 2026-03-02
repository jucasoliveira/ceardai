"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";

function AcceptInviteForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spotNumber, setSpotNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!token) {
      setValidationError("No invite token provided");
      setLoading(false);
      return;
    }

    async function validate() {
      try {
        const res = await fetch(`/api/founders/accept?token=${token}`);
        const data = await res.json();
        if (!res.ok) {
          setValidationError(data.error || "Invalid invite");
        } else {
          setName(data.name);
          setEmail(data.email);
          setSpotNumber(data.spotNumber);
        }
      } catch {
        setValidationError("Failed to validate invite");
      } finally {
        setLoading(false);
      }
    }

    validate();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Create account via Better Auth
      const result = await signUp.email({ email, password, name });
      if (result.error) {
        setError(result.error.message || "Could not create account");
        setSubmitting(false);
        return;
      }

      // Accept the invite with the new userId
      const userId = result.data?.user?.id;
      if (!userId) {
        setError("Account created but could not get user ID");
        setSubmitting(false);
        return;
      }

      const acceptRes = await fetch("/api/founders/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId }),
      });

      if (!acceptRes.ok) {
        const data = await acceptRes.json();
        setError(data.error || "Failed to accept invite");
        setSubmitting(false);
        return;
      }

      router.push("/portal");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-charcoal/40 text-sm">Validating invite...</p>
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="font-serif text-3xl tracking-wide">
            Ceardaí
          </Link>
          <div className="w-12 h-px bg-amber mx-auto mt-4 mb-8"></div>
          <div className="bg-white rounded-xl shadow-exhibit p-8">
            <h2 className="font-serif text-xl text-charcoal mb-4">
              Invalid Invite
            </h2>
            <p className="text-charcoal/60 text-sm mb-6">{validationError}</p>
            <Link
              href="/login"
              className="text-sm text-amber hover:text-amber/80 transition-colors"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl tracking-wide">
            Ceardaí
          </Link>
          <div className="w-12 h-px bg-amber mx-auto mt-4 mb-6"></div>
          <p className="text-charcoal/60 text-sm">
            You&apos;ve been invited to become Founder #{spotNumber}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-burgundy/10 text-burgundy text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-exhibit p-8">
          <h2 className="font-serif text-xl text-charcoal mb-6">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 bg-cream/50 border border-charcoal/10 rounded-lg text-charcoal/60 cursor-not-allowed"
              />
              <p className="text-xs text-charcoal/40 mt-1">
                Email is set by your invitation
              </p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
              <p className="text-xs text-charcoal/40 mt-1">
                Minimum 8 characters
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-charcoal text-cream px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Creating account..." : "Accept & Join"}
            </button>
          </form>
        </div>

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

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-charcoal/40 text-sm">Loading...</p>
        </div>
      }
    >
      <AcceptInviteForm />
    </Suspense>
  );
}
