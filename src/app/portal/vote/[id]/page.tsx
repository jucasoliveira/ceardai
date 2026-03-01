"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useParams } from "next/navigation";
import type { VoteSummary } from "@/types";

export default function VoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();

  const [vote, setVote] = useState<VoteSummary | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userVotedOption, setUserVotedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isFounder, setIsFounder] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch vote details
        const voteRes = await fetch(`/api/votes/${id}`);
        if (!voteRes.ok) {
          setError("Failed to load vote.");
          setLoading(false);
          return;
        }
        const voteData = await voteRes.json();
        setVote(voteData);

        // Check founder status
        const founderRes = await fetch("/api/founders");
        if (founderRes.ok) {
          const founders = await founderRes.json();
          const userId = session?.user?.id;
          const found = founders.some(
            (f: { userId: string; isActive: boolean }) =>
              f.userId === userId && f.isActive
          );
          setIsFounder(found);
        } else {
          setIsFounder(false);
        }

        // Check if user already voted
        const castRes = await fetch(`/api/votes/${id}/cast`);
        if (castRes.ok) {
          const castData = await castRes.json();
          if (castData.optionId) {
            setUserVotedOption(castData.optionId);
            setSelectedOption(castData.optionId);
          }
        }
      } catch {
        setError("Something went wrong loading the vote.");
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchData();
    }
  }, [id, session]);

  async function handleSubmit() {
    if (!selectedOption) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/votes/${id}/cast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selectedOption }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to cast vote.");
        return;
      }

      setUserVotedOption(selectedOption);
      setSuccess(true);

      // Refresh vote data for updated counts
      const refreshRes = await fetch(`/api/votes/${id}`);
      if (refreshRes.ok) {
        setVote(await refreshRes.json());
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="py-8 px-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg p-12 text-center text-charcoal/40">
          Loading vote...
        </div>
      </div>
    );
  }

  if (isFounder === false) {
    return (
      <div className="py-8 px-6 max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl mb-8">Founder Vote</h1>
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="font-serif text-xl text-charcoal/60 mb-2">Founders Only</p>
          <p className="text-sm text-charcoal/40">
            Voting is exclusively available to Ceardai Founders.
          </p>
        </div>
      </div>
    );
  }

  if (!vote) {
    return (
      <div className="py-8 px-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg p-12 text-center text-charcoal/40">
          Vote not found.
        </div>
      </div>
    );
  }

  const totalVotes = vote.options.reduce((sum, opt) => sum + opt.votes, 0);
  const hasVoted = !!userVotedOption;
  const isOpen = vote.status === "open";

  return (
    <div className="py-8 px-6 max-w-3xl mx-auto">
      <h1 className="font-serif text-3xl mb-2">{vote.title}</h1>
      <div className="flex gap-4 text-sm text-charcoal/60 mb-8">
        <span
          className={`inline-block text-xs px-2.5 py-1 rounded-full uppercase tracking-widest font-medium ${
            isOpen ? "bg-forest/10 text-forest" : "bg-charcoal/10 text-charcoal/60"
          }`}
        >
          {vote.status}
        </span>
        <span>Closes {new Date(vote.closesAt).toLocaleDateString()}</span>
        <span>{totalVotes} vote{totalVotes !== 1 ? "s" : ""} cast</span>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-burgundy/10 text-burgundy text-sm rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-forest/10 text-forest text-sm rounded-lg">
          Your vote has been recorded.
        </div>
      )}

      {hasVoted && !success && (
        <div className="mb-6 p-4 bg-amber/10 text-amber text-sm rounded-lg">
          You have already cast your vote.
        </div>
      )}

      <div className="space-y-3">
        {vote.options.map((option) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isSelected = selectedOption === option.id;
          const isUserVote = userVotedOption === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={hasVoted || !isOpen}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full text-left bg-white rounded-lg p-5 border transition-colors ${
                isSelected
                  ? "border-amber ring-1 ring-amber"
                  : "border-charcoal/10 hover:border-charcoal/20"
              } ${hasVoted || !isOpen ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <p className="font-serif text-base">
                    {option.label}
                    {isUserVote && (
                      <span className="ml-2 text-xs text-amber uppercase tracking-widest">
                        Your vote
                      </span>
                    )}
                  </p>
                  {option.description && (
                    <p className="text-sm text-charcoal/60 mt-1">{option.description}</p>
                  )}
                </div>
                {(hasVoted || !isOpen) && (
                  <span className="text-sm text-charcoal/60 shrink-0 ml-4">
                    {option.votes} ({percentage}%)
                  </span>
                )}
              </div>
              {(hasVoted || !isOpen) && (
                <div className="mt-3 h-1.5 bg-charcoal/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isOpen && !hasVoted && (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || submitting}
          className="mt-6 w-full bg-charcoal text-cream px-8 py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Cast Vote"}
        </button>
      )}
    </div>
  );
}
