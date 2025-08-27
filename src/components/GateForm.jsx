"use client";
import { useState } from "react";

export default function GateForm({ nextUrl = "/check/review" }) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(
          data?.error === "INVALID_PASSWORD"
            ? "Incorrect password"
            : data?.error === "PASSWORD_NOT_SET"
            ? "Server not configured"
            : "Error, please try again."
        );
        return;
      }
      // cookie set -> go to intended page
      location.href = nextUrl;
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-6 w-full max-w-[560px]">
      <input
        type="password"
        placeholder="Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        suppressHydrationWarning
        autoComplete="off"
        className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3 text-[15px]
                   placeholder:text-[#9AA8B5] outline-none focus:ring-2 focus:ring-[#DD5124]/20"
      />
      <button
        type="submit"
        disabled={!pw.trim() || loading}
        className="mt-4 inline-flex h-[44px] w-full items-center justify-center rounded-[10px] bg-[#DD5124]
                   px-6 text-[15px] font-semibold text-white shadow-sm hover:opacity-95
                   focus:outline-none focus:ring-2 focus:ring-[#DD5124]/30 disabled:opacity-50"
      >
        {loading ? "Checking..." : "Enter"}
      </button>
      {err && <p className="mt-2 text-[13px] text-[#DC2626]">{err}</p>}
    </form>
  );
}
