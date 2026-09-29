"use client";
import { useState } from "react";
import { IconUser } from "./icons";

/** User avatar with graceful fallback to initials. */
export default function Avatar({ userId, name, size = 28, ext = "", className = "" }: { userId: string; name: string; size?: number; ext?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };
  if (failed) {
    return (
      <span className={`inline-flex items-center justify-center rounded-full font-bold ${className}`}
        style={{ ...style, background: "linear-gradient(135deg, var(--accent-dim), var(--accent))", color: "#04120a", fontSize: size * 0.42 }}
        aria-hidden>
        {name.trim().charAt(0).toUpperCase() || <IconUser size={size * 0.55} />}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/avatars/${userId}.${ext || "png"}`} alt={`${name}'s avatar`} width={size} height={size}
      style={style} onError={() => setFailed(true)}
      className={`rounded-full object-cover border border-edge bg-panel-2 ${className}`} />
  );
}
