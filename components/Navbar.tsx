import Link from "next/link";
import Image from "next/image";
import { getSessionUser } from "@/lib/session";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const user = await getSessionUser();
  return (
    <header className="border-b border-edge bg-void/95 sticky top-0 z-40 no-print">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Tech Sol logo" width={32} height={32} className="rounded-lg" />
          <span className="font-mono font-bold text-lg">Can you <span className="text-neon">Hack?</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-5 text-sm text-zinc-400">
          <Link href="/paths" className="hover:text-white">Learning paths</Link>
          <Link href="/lab" className="hover:text-white">Terminal lab</Link>
          <Link href="/report" className="hover:text-white">Report</Link>
          <Link href="/ethics" className="hover:text-white">Ethics</Link>
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className="text-zinc-300 hover:text-white hidden sm:inline">
                Hi, {user.name.split(" ")[0]}
              </Link>
              {user.isAdmin && (
                <Link href="/admin" className="text-yellow-300 hover:text-yellow-200 font-mono text-xs border border-yellow-900 rounded px-2 py-1">
                  ADMIN
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-zinc-300 hover:text-white">Log in</Link>
              <Link href="/signup" className="bg-neon text-black font-semibold px-4 py-2 rounded-lg hover:bg-neon-dim">
                Start hacking
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
