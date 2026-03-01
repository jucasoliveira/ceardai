"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import TierBadge from "@/components/TierBadge";
import type { UserTier } from "@/types";

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (!session) {
    return (
      <div className="py-8 px-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg p-12 text-center text-charcoal/40">
          Loading account...
        </div>
      </div>
    );
  }

  const user = session.user;
  const tier = ((user as Record<string, unknown>).tier as UserTier) || "consumer";
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="py-8 px-6 max-w-3xl mx-auto">
      <h1 className="font-serif text-3xl mb-8">Account</h1>

      <div className="bg-white rounded-lg border border-charcoal/10 overflow-hidden">
        {/* Profile section */}
        <div className="p-6 border-b border-charcoal/10">
          <h2 className="text-xs uppercase tracking-widest text-charcoal/40 font-medium mb-4">
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-1">Name</p>
              <p className="font-serif text-lg">{user.name || "Not set"}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-1">Email</p>
              <p className="text-sm">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-1">
                Membership Tier
              </p>
              <div className="mt-1">
                <TierBadge tier={tier} />
              </div>
            </div>
            <div>
              <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-1">
                Member Since
              </p>
              <p className="text-sm">{memberSince}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <button
            onClick={handleSignOut}
            className="bg-charcoal text-cream px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
