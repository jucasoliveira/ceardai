"use client";

import { useState, useEffect, useCallback } from "react";
import type { VoteSummary, VoteStatus } from "@/types";

const STATUS_COLORS: Record<VoteStatus, string> = {
  open: "bg-forest/20 text-forest",
  closed: "bg-amber/20 text-amber",
  tallied: "bg-charcoal/10 text-charcoal/60",
};

export default function AdminVotesPage() {
  const [votes, setVotes] = useState<VoteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Create form state
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([
    { label: "", description: "" },
    { label: "", description: "" },
  ]);
  const [opensAt, setOpensAt] = useState("");
  const [closesAt, setClosesAt] = useState("");

  const fetchVotes = useCallback(async () => {
    try {
      const res = await fetch("/api/votes");
      const data = await res.json();
      setVotes(data);
    } catch {
      console.error("Failed to fetch votes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  function addOption() {
    setOptions((prev) => [...prev, { label: "", description: "" }]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateOption(
    index: number,
    field: "label" | "description",
    value: string
  ) {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt))
    );
  }

  async function handleCreateVote(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          options: options.map((opt, i) => ({
            id: `option-${i + 1}`,
            label: opt.label,
            description: opt.description,
            votes: 0,
          })),
          opensAt: new Date(opensAt).toISOString(),
          closesAt: new Date(closesAt).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create vote");
      }

      setShowCreate(false);
      setTitle("");
      setOptions([
        { label: "", description: "" },
        { label: "", description: "" },
      ]);
      setOpensAt("");
      setClosesAt("");
      setSuccessMsg("Vote created successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchVotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  async function handleStatusChange(voteId: string, newStatus: VoteStatus) {
    try {
      const res = await fetch(`/api/votes/${voteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setSuccessMsg(`Vote ${newStatus} successfully`);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchVotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update vote");
    }
  }

  const inputClass =
    "w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors text-sm";
  const labelClass =
    "block text-xs uppercase tracking-widest text-charcoal/60 mb-2";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Votes</h1>
          <p className="text-charcoal/50 text-sm mt-1">
            Manage community votes for beer selection
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-amber text-white px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-amber/90 transition-colors"
        >
          {showCreate ? "Cancel" : "Create Vote"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-burgundy/10 text-burgundy text-sm rounded-lg">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-3 bg-forest/10 text-forest text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      {/* Create Vote Form */}
      {showCreate && (
        <div className="bg-white rounded-xl shadow-exhibit p-6 mb-8">
          <h2 className="font-serif text-lg text-charcoal mb-4">
            Create New Vote
          </h2>
          <form onSubmit={handleCreateVote} className="space-y-4 max-w-xl">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="What should Batch #5 be?"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Options</label>
              <div className="space-y-3">
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-3">
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => updateOption(i, "label", e.target.value)}
                      placeholder={`Option ${i + 1} label`}
                      required
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={opt.description}
                      onChange={(e) =>
                        updateOption(i, "description", e.target.value)
                      }
                      placeholder="Description (optional)"
                      className={inputClass}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="px-3 py-2 text-burgundy hover:text-burgundy/80 text-sm transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                className="mt-2 text-sm text-amber hover:text-amber/80 transition-colors"
              >
                + Add option
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Opens At</label>
                <input
                  type="datetime-local"
                  value={opensAt}
                  onChange={(e) => setOpensAt(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Closes At</label>
                <input
                  type="datetime-local"
                  value={closesAt}
                  onChange={(e) => setClosesAt(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="bg-charcoal text-cream px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Vote"}
            </button>
          </form>
        </div>
      )}

      {/* Votes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-exhibit p-12 text-center text-charcoal/40 text-sm">
            Loading votes...
          </div>
        ) : votes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-exhibit p-12 text-center text-charcoal/40 text-sm">
            No votes created yet
          </div>
        ) : (
          votes.map((vote) => (
            <div
              key={vote._id}
              className="bg-white rounded-xl shadow-exhibit p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-charcoal">
                  {vote.title}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                    STATUS_COLORS[vote.status]
                  }`}
                >
                  {vote.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-charcoal/40 mb-1">Opens</p>
                  <p className="text-charcoal">
                    {new Date(vote.opensAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-charcoal/40 mb-1">Closes</p>
                  <p className="text-charcoal">
                    {new Date(vote.closesAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-charcoal/40 mb-1">Options</p>
                  <p className="text-charcoal">{vote.options.length}</p>
                </div>
                <div>
                  <p className="text-charcoal/40 mb-1">Total Votes</p>
                  <p className="text-charcoal">
                    {vote.options.reduce((sum, o) => sum + o.votes, 0)}
                  </p>
                </div>
              </div>

              {/* Options with vote counts */}
              <div className="space-y-2 mb-4">
                {vote.options.map((opt) => {
                  const totalVotes = vote.options.reduce(
                    (sum, o) => sum + o.votes,
                    0
                  );
                  const pct =
                    totalVotes > 0
                      ? Math.round((opt.votes / totalVotes) * 100)
                      : 0;
                  return (
                    <div key={opt.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-charcoal">{opt.label}</span>
                          <span className="text-charcoal/50">
                            {opt.votes} votes ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-charcoal/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3 border-t border-charcoal/10">
                {vote.status === "open" && (
                  <button
                    onClick={() => handleStatusChange(vote._id, "closed")}
                    className="bg-amber text-white px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-amber/90 transition-colors"
                  >
                    Close Voting
                  </button>
                )}
                {vote.status === "closed" && (
                  <button
                    onClick={() => handleStatusChange(vote._id, "tallied")}
                    className="bg-charcoal text-cream px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-charcoal/90 transition-colors"
                  >
                    Tally Results
                  </button>
                )}
                {vote.status === "tallied" && (
                  <span className="text-charcoal/40 text-xs uppercase tracking-widest py-2">
                    Results finalized
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
