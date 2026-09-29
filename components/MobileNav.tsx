"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IconMenu, IconX, IconTerminal, IconCrown, IconShield, IconChart, IconUser } from "./icons";

export default function MobileNav({ user }: { user: { name: string; isAdmin: boolean } | null }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open ]);
  const links = [
    { href: "/paths", label: "Learning paths", icon: IconTerminal },
    { href: "/leaderboard", label: "Rankings", icon: IconCrown },
    { href: "/lab", label: "Terminal lab", icon: IconTerminal },
    { href: "/report", label: "Report builder", icon: IconChart },
    { href: "/ethics", label: "Ethics", icon: IconShield },
  ];
  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open} className="p-2 rounded-lg border border-edge text-zinc-400 hover:text-neon hover:border-neon">
        {open ? <IconX size={18} /> : <IconMenu size={18} />}
      </button>
      {open && (
        <div className="absolute top-16 left-0 right-0 border-b border-edge p-4 space-y-1 anim-fade-in"
          style={{ background: "var(--bg)" }}>
          {links.map(({ href, label, icon: Ic }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:text-neon hover:bg-neon/5 font-medium">
              <Ic size={18} />{label}
            </Link>
          ))}
          {user && (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:text-neon hover:bg-neon/5 font-medium">
                <IconChart size={18} />Dashboard
              </Link>
              <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:text-neon hover:bg-neon/5 font-medium">
                <IconUser size={18} />Profile
              </Link>
              {user.isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-amber-500 font-medium">
                  <IconShield size={18} />Admin
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
