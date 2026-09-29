import Link from "next/link";
import Image from "next/image";
import { getSessionUser } from "@/lib/session";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import Avatar from "./Avatar";
import { IconTerminal, IconTrophy, IconCrown, IconShield } from "./icons";

export default async function Navbar() {
  const user = await getSessionUser();
  return (
    <header className="border-b border-edge sticky top-0 z-40 no-print"
      style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)", backdropFilter: "blur(14px)" }}>
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-5" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative">
            <Image src="/logo.png" alt="Tech Sol logo" width={34} height={34} className="rounded-xl transition-transform group-hover:scale-105" />
            <span className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: "0 0 18px var(--hero-glow)" }} />
          </span>
          <span className="font-mono font-bold text-lg tracking-tight">
            Can you <span className="text-neon">Hack?</span>
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {[
            { href: "/paths", label: "Learning paths", icon: IconTerminal },
            { href: "/leaderboard", label: "Rankings", icon: IconCrown },
            { href: "/lab", label: "Terminal lab", icon: IconTerminal },
            { href: "/ethics", label: "Ethics", icon: IconShield },
          ].map(({ href, label, icon: Ic }) => (
            <Link key={href} href={href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-neon hover:bg-neon/5 transition-colors">
              <Ic size={16} />{label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard" className="hidden sm:flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full border border-edge hover:border-neon transition-colors">
                <Avatar userId={user.id} name={user.name} size={28} ext={user.avatar || ""} />
                <span className="text-sm font-semibold text-zinc-300">{user.name.split(" ")[0]}</span>
              </Link>
              {user.isAdmin && (
                <Link href="/admin" className="hidden md:inline font-mono text-[11px] font-bold tracking-wider px-2.5 py-1.5 rounded-lg border border-amber-500/50 text-amber-500 hover:bg-amber-500/10">
                  ADMIN
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-zinc-300 hover:text-neon px-3 py-2">Log in</Link>
              <Link href="/signup" className="btn-primary !py-2.5 !px-5 text-sm">
                <IconTrophy size={16} /> Start hacking
              </Link>
            </>
          )}
          <MobileNav user={user ? { name: user.name, isAdmin: user.isAdmin } : null} />
        </div>
      </nav>
    </header>
  );
}
