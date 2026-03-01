export const dynamic = "force-dynamic";

import { requireSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Founder from "@/models/Founder";
import Vote from "@/models/Vote";
import type { VoteStatus } from "@/types";
import Link from "next/link";

export default async function VoteListPage() {
  let session;
  try {
    session = await requireSession();
  } catch {
    redirect("/login");
  }

  await connectDB();

  // Check founder status
  const founder = await Founder.findOne({
    userId: session.user.id,
    isActive: true,
  }).lean();

  if (!founder) {
    return (
      <div className="py-8 px-6 max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl mb-8">Founder Votes</h1>
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="font-serif text-xl text-charcoal/60 mb-2">Founders Only</p>
          <p className="text-sm text-charcoal/40">
            Voting is exclusively available to Ceardai Founders. This section is reserved
            for members who hold a founding spot.
          </p>
        </div>
      </div>
    );
  }

  const votes = await Vote.find({ status: { $in: ["open", "closed"] } })
    .sort({ opensAt: -1 })
    .lean();

  const statusStyle: Record<string, string> = {
    open: "bg-forest/10 text-forest",
    closed: "bg-charcoal/10 text-charcoal/60",
    tallied: "bg-amber/10 text-amber",
  };

  return (
    <div className="py-8 px-6 max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl mb-8">Founder Votes</h1>

      {votes.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center text-charcoal/40">
          <p className="font-serif text-lg mb-2">No active votes</p>
          <p className="text-sm">New votes will appear here when they are announced.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {votes.map((vote) => (
            <Link
              key={String(vote._id)}
              href={`/portal/vote/${String(vote._id)}`}
              className="block bg-white rounded-lg p-6 border border-charcoal/10 hover:border-charcoal/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif text-lg">{vote.title}</h3>
                <span
                  className={`inline-block text-xs px-2.5 py-1 rounded-full uppercase tracking-widest font-medium ${
                    statusStyle[vote.status as VoteStatus] || statusStyle.closed
                  }`}
                >
                  {vote.status}
                </span>
              </div>
              <div className="flex gap-4 text-sm text-charcoal/60">
                <span>{vote.options.length} options</span>
                <span>Opens {new Date(vote.opensAt).toLocaleDateString()}</span>
                <span>Closes {new Date(vote.closesAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
