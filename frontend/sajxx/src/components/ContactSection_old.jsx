'use client';

import { useState, useTransition } from "react";

import Section from "@/components/Section";
import Button from "@/components/Button";
import { api } from "@/lib/axios";

export default function ContactSection() {
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    setStatus({ type: null, message: "" });

    startTransition(async () => {
      try {
        await api.submitContact(payload);
        form.reset();
        setStatus({
          type: "success",
          message: "Thanks for reaching out! I’ll get back to you shortly.",
        });
      } catch (error) {
        setStatus({
          type: "error",
          message:
            error?.response?.data?.message ??
            error?.message ??
            "Something went wrong. Please try again.",
        });
      }
    });
  };

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let’s Collaborate"
      className="space-y-10"
    >
      <form
        onSubmit={handleSubmit}
        className="grid gap-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 md:grid-cols-2"
      >
        <label className="flex flex-col gap-2 text-sm">
          Name
          <input
            type="text"
            name="name"
            required
            className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 text-base text-white focus:border-blue-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 text-base text-white focus:border-blue-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm md:col-span-2">
          Subject
          <input
            type="text"
            name="subject"
            className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 text-base text-white focus:border-blue-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm md:col-span-2">
          Message
          <textarea
            name="message"
            rows={6}
            required
            className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 text-base text-white focus:border-blue-400"
          />
        </label>
        <div className="md:col-span-2">
          <Button
            as="button"
            type="submit"
            className={`px-8 py-4 text-base ${isPending ? "animate-glow" : ""}`}
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
      {status.message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm transition-colors ${
            status.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/40 bg-rose-500/10 text-rose-200"
          }`}
        >
          {status.message}
        </div>
      )}
    </Section>
  );
}
