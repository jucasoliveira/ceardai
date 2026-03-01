"use client";

import { useState, useEffect, useCallback } from "react";
import type { MessageSummary, MessageStatus } from "@/types";

const STATUS_COLORS: Record<MessageStatus, string> = {
  unread: "bg-amber/20 text-amber",
  read: "bg-charcoal/10 text-charcoal/60",
  replied: "bg-forest/20 text-forest",
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<MessageSummary | null>(
    null
  );
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchMessages = useCallback(async () => {
    try {
      const query = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/admin/messages${query}`);
      const data = await res.json();
      setMessages(data);
    } catch {
      console.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function handleSelectMessage(id: string) {
    setSelectedId(id);
    setReply("");
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/messages/${id}`);
      const data = await res.json();
      setSelectedMessage(data);

      // Update message in list as read
      setMessages((prev) =>
        prev.map((m) =>
          m._id === id && m.status === "unread" ? { ...m, status: "read" } : m
        )
      );
    } catch {
      setError("Failed to load message");
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !reply.trim()) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/messages/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminReply: reply }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      const updated = await res.json();
      setSelectedMessage(updated);
      setReply("");
      setSuccessMsg("Reply sent successfully");
      setTimeout(() => setSuccessMsg(""), 3000);

      // Update in list
      setMessages((prev) =>
        prev.map((m) =>
          m._id === selectedId
            ? { ...m, status: "replied" as MessageStatus, adminReply: updated.adminReply }
            : m
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Messages</h1>
        <p className="text-charcoal/50 text-sm mt-1">
          Inbox from the contact form
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex border-b border-charcoal/10 mb-6">
        {[
          { label: "All", value: "all" },
          { label: "Unread", value: "unread" },
          { label: "Read", value: "read" },
          { label: "Replied", value: "replied" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setSelectedId(null);
              setSelectedMessage(null);
            }}
            className={`px-4 pb-3 text-sm uppercase tracking-widest transition-colors ${
              statusFilter === tab.value
                ? "text-charcoal border-b-2 border-amber"
                : "text-charcoal/40 hover:text-charcoal/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-exhibit overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-charcoal/40 text-sm">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-charcoal/40 text-sm">
              No messages
            </div>
          ) : (
            <div className="divide-y divide-charcoal/5 max-h-[70vh] overflow-y-auto">
              {messages.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => handleSelectMessage(msg._id)}
                  className={`w-full text-left p-4 hover:bg-cream/50 transition-colors ${
                    selectedId === msg._id ? "bg-cream" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm ${
                        msg.status === "unread"
                          ? "font-semibold text-charcoal"
                          : "text-charcoal/70"
                      }`}
                    >
                      {msg.name}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${
                        STATUS_COLORS[msg.status]
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      msg.status === "unread"
                        ? "font-medium text-charcoal"
                        : "text-charcoal/60"
                    }`}
                  >
                    {msg.subject}
                  </p>
                  <p className="text-xs text-charcoal/40 mt-1">
                    {new Date(msg.createdAt).toLocaleDateString()} &middot;{" "}
                    {msg.email}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail / Reply */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-exhibit overflow-hidden">
          {!selectedMessage ? (
            <div className="p-12 text-center text-charcoal/40 text-sm">
              Select a message to view details
            </div>
          ) : (
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-burgundy/10 text-burgundy text-sm rounded-lg">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 bg-forest/10 text-forest text-sm rounded-lg">
                  {successMsg}
                </div>
              )}

              {/* Message Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-serif text-xl text-charcoal">
                    {selectedMessage.subject}
                  </h2>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                      STATUS_COLORS[selectedMessage.status]
                    }`}
                  >
                    {selectedMessage.status}
                  </span>
                </div>
                <p className="text-sm text-charcoal/50">
                  From: {selectedMessage.name} ({selectedMessage.email})
                </p>
                <p className="text-xs text-charcoal/40 mt-1">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Message Body */}
              <div className="bg-cream/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-charcoal whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.body}
                </p>
              </div>

              {/* Existing Reply */}
              {selectedMessage.adminReply && (
                <div className="bg-forest/5 border-l-4 border-forest rounded-lg p-4 mb-6">
                  <p className="text-xs uppercase tracking-widest text-forest/60 mb-2">
                    Your Reply
                  </p>
                  <p className="text-sm text-charcoal whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.adminReply}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              {selectedMessage.status !== "replied" && (
                <form onSubmit={handleReply}>
                  <label className="block text-xs uppercase tracking-widest text-charcoal/60 mb-2">
                    Reply
                  </label>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={4}
                    required
                    placeholder="Write your reply..."
                    className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg focus:outline-none focus:border-amber transition-colors text-sm mb-3"
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="bg-charcoal text-cream px-6 py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send Reply"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
