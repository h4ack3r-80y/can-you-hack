"use client";
import { useState } from "react";

export default function EthicsBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="bg-yellow-950/40 border-b border-yellow-900/60 no-print" role="note">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3 text-sm">
        <span aria-hidden>⚖️</span>
        <p className="text-yellow-200/90 flex-1">
          Education only. Only test systems you own or have <strong>written permission</strong> to test. Everything here is simulated.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-400 hover:text-yellow-200 text-xs shrink-0"
          aria-label="Dismiss ethics notice for this session"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
