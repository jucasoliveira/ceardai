"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export default function PortalInvitePage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasUsedInvite, setHasUsedInvite] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkInviteStatus() {
      try {
        const res = await fetch("/api/founders");
        const founders = await res.json();
        const userId = session?.user?.id;
        if (userId) {
          const me = founders.find(
            (f: { userId: string }) => f.userId === userId
          );
          if (me) {
            setHasUsedInvite(me.hasUsedInvite);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.id) {
      checkInviteStatus();
    }
  }, [session?.user?.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/founders/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send invite");
        return;
      }

      if (data.waitingList) {
        setSuccess(
          "All founder spots are currently filled. Your friend has been added to the waiting list."
        );
      } else {
        setSuccess(
          `Invite sent to ${email}! They've been assigned spot #${data.spotNumber}.`
        );
      }
      setHasUsedInvite(true);
      setName("");
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-charcoal/40 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-3xl text-charcoal mb-2">
        Invite a Founder
      </h1>
      <p className="text-charcoal/50 text-sm mb-8">
        As a founding member, you have one invite to share with someone special.
      </p>

      {hasUsedInvite ? (
        <div className="bg-white rounded-xl shadow-exhibit p-8">
          <h2 className="font-serif text-lg text-charcoal mb-2">
            Invite Used
          </h2>
          <p className="text-charcoal/60 text-sm">
            You&apos;ve already used your founder invite. Each founding member
            receives one invite ticket.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-exhibit p-8">
          {error && (
            <div className="mb-6 p-3 bg-burgundy/10 text-burgundy text-sm rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 bg-forest/10 text-forest text-sm rounded-lg">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
                Their Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Friend's name"
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
                Their Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="friend@example.com"
                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-charcoal text-cream px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Sending invite..." : "Send Invite"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
