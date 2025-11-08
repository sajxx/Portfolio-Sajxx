'use client';

import { useEffect } from "react";

import Button from "@/components/Button";
import Card from "@/components/Card";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Landing page failed", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <Card className="w-full space-y-4 border-rose-500/30 bg-rose-500/10 p-10 text-rose-100">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-rose-200/80">
          {error?.message ?? "We couldn’t load the portfolio data right now."}
        </p>
        <div className="flex justify-center">
          <Button as="button" onClick={() => reset()} className="px-6 py-3">
            Try Again
          </Button>
        </div>
      </Card>
    </main>
  );
}
