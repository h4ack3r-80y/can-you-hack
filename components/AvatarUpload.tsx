"use client";
import { useRef, useState } from "react";
import Avatar from "./Avatar";
import { IconCamera } from "./icons";

export default function AvatarUpload({ userId, name, ext }: { userId: string; name: string; ext: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try {
      const form = new FormData();
      form.append("avatar", file);
      const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setTick(Date.now());
      // reload so navbar avatar refreshes too
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-5">
      <div key={tick} className="relative group">
        <Avatar userId={userId} name={name} size={88} ext={ext} />
        <button onClick={() => inputRef.current?.click()} disabled={busy}
          aria-label="Upload profile picture"
          className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity flex items-center justify-center text-white">
          <IconCamera size={26} />
        </button>
      </div>
      <div>
        <button onClick={() => inputRef.current?.click()} disabled={busy}
          className="btn-ghost !py-2 !px-4 text-sm">
          <IconCamera size={16} /> {busy ? "Uploading…" : "Change photo"}
        </button>
        <p className="text-xs text-zinc-500 mt-2">PNG, JPEG, or WebP · under 2 MB</p>
        {error && <p className="text-xs mt-1.5 font-semibold" style={{ color: "var(--danger)" }}>{error}</p>}
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp"
          className="sr-only" onChange={onPick} aria-label="Choose profile picture" />
      </div>
    </div>
  );
}
