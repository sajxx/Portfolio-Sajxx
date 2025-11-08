'use client';

import { useEffect, useMemo, useState, useTransition } from "react";

import Card from "@/components/Card";
import Button from "@/components/Button";
import { api } from "@/lib/axios";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in-progress", label: "In progress" },
  { value: "closed", label: "Closed" },
];

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [status, setStatus] = useState(null);
  const [isPending, startTransition] = useTransition();

  const loadMessages = async (filter) => {
    try {
      const params = filter && filter !== "all" ? { status: filter } : undefined;
      const data = await api.getMessages(params);
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  useEffect(() => {
    loadMessages(statusFilter);
  }, [statusFilter]);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [messages]
  );

  const handleStatusChange = (messageId, newStatus) => {
    startTransition(async () => {
      try {
        const updated = await api.updateMessageStatus(messageId, newStatus);
        setMessages((prev) => prev.map((msg) => (msg._id === messageId ? updated : msg)));
        setStatus({ type: "success", message: "Message updated" });
      } catch (error) {
        setStatus({
          type: "error",
          message: error?.response?.data?.message ?? "Unable to update message",
        });
      }
    });
  };

  const handleDelete = (messageId) => {
    startTransition(async () => {
      try {
        await api.deleteMessage(messageId);
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      } catch (error) {
        setStatus({
          type: "error",
          message: error?.response?.data?.message ?? "Unable to delete message",
        });
      }
    });
  };

  return (
    <Card className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Messages</h2>
          <p className="text-sm text-slate-400">Track incoming inquiries and keep your inbox tidy.</p>
        </div>
        {status && (
          <span
            className={`text-sm ${
              status.type === "success" ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {status.message}
          </span>
        )}
      </header>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-slate-400">Filter:</span>
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setStatusFilter(option.value)}
            className={`rounded-full border px-3 py-1 transition ${
              statusFilter === option.value
                ? "border-blue-400 text-blue-200"
                : "border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
        <Button
          as="button"
          variant="secondary"
          onClick={() => loadMessages(statusFilter)}
          disabled={isPending}
          className="ml-auto px-4 py-2"
        >
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {sortedMessages.map((message) => (
          <article
            key={message._id}
            className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">{message.subject}</h3>
                <p className="text-xs text-slate-400">
                  {message.name} · {message.email}
                </p>
              </div>
              <p className="text-xs text-slate-500">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
            <p className="whitespace-pre-line text-sm text-slate-200">{message.message}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-300">
                Status
                <select
                  value={message.status}
                  onChange={(event) => handleStatusChange(message._id, event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-white"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In progress</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => handleDelete(message._id)}
                className="rounded-full border border-rose-600 px-3 py-1 text-rose-200 hover:bg-rose-600/20"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
        {!sortedMessages.length && (
          <p className="text-sm text-slate-400">No messages for this filter.</p>
        )}
      </div>
    </Card>
  );
}
