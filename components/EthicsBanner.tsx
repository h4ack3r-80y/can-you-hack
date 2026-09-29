"use client";
import { useEffect, useState } from "react";

export default function EthicsBanner() {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    // Read persisted dismissal after hydration to avoid SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { if (sessionStorage.getItem("cyh-ethics-dismissed") === "1") setDismissed(true); } catch { /* ignore */ }
  }, []);
  const dismiss = () => {
    try { sessionStorage.setItem("cyh-ethics-dismissed", "1"); } catch { /* ignore */ }
    setDismissed(true);
  };
  if (dismissed) return null;
  return (
    <div className="border-b no-print" role="note"
      style={{
        background: "color-mix(in srgb, var(--warn) 10%, transparent)",
        borderColor: "color-mix(in srgb, var(--warn) 30%, transparent)",
      }}>
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3 text-sm">
        <span aria-hidden>⚖️</span>
        <p className="flex-1" style={{ color: "var(--muted)" }}>
          Education only. Only test systems you own or have{" "}
          <strong style={{ color: "var(--ink)" }}>written permission</strong> to test.
          Everything here is simulated.
        </p>
        <button
          onClick={dismiss}
          className="text-xs font-semibold shrink-0 hover:opacity-80"
          style={{ color: "var(--warn)" }}
          aria-label="Dismiss ethics notice for this session"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
