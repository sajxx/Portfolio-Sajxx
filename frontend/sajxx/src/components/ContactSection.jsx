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
          message: "Thanks for reaching out! I'll get back to you shortly.",
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
      eyebrow="Get In Touch"
      title="Let's Create Something Amazing"
      className="space-y-10"
    >
      <p className="text-lg text-slate-400 max-w-3xl mx-left text-left">
        Got a project in mind? Whether you need a website, an app, or just want to chat 
        about tech, I'd love to hear from you. Let's turn your ideas into reality.
      </p>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all card-hover">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Email</h3>
            <p className="text-slate-400 text-sm">Drop me a line anytime</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all card-hover">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Location</h3>
            <p className="text-slate-400 text-sm">Available for remote work</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 transition-all card-hover">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Response Time</h3>
            <p className="text-slate-400 text-sm">Usually within 24 hours</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8 border border-white/10 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="What's this about?"
                className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                rows={6}
                required
                placeholder="Tell me about your project or idea..."
                className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
            </div>

            <Button
              as="button"
              type="submit"
              className={`w-full sm:w-auto px-8 py-4 text-base group ${
                isPending ? "animate-pulse" : ""
              }`}
              disabled={isPending}
            >
              <span className="flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </Button>
          </form>

          {/* Status Message */}
          {status.message && (
            <div
              className={`mt-6 rounded-xl border px-6 py-4 flex items-start gap-3 animate-fadeInUp ${
                status.type === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-rose-500/40 bg-rose-500/10"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {status.type === "success" ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <p className={`text-sm ${status.type === "success" ? "text-emerald-200" : "text-rose-200"}`}>
                {status.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
