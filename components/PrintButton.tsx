"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="bg-neon text-black font-bold px-5 py-2.5 rounded-lg hover:bg-neon-dim text-sm">
      Print / Save PDF
    </button>
  );
}
