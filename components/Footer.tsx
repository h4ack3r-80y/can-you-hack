import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import { IconShield, IconTerminal, IconCrown } from "./icons";

export default function Footer() {
  return (
    <footer className="border-t border-edge mt-16 no-print" style={{ background: "var(--bg-soft)" }}>
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <Image src="/logo.png" alt="Tech Sol logo" width={30} height={30} className="rounded-lg" />
            <span className="font-mono font-bold">Can you <span className="text-neon">Hack?</span></span>
          </Link>
          <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
            {site.tagline} Free, open-source cybersecurity training — penetration testing,
            digital forensics, and network analysis — in simulated labs that run entirely in your browser.
          </p>
          <p className="text-xs text-zinc-600 mt-4 font-mono">
            © 2026 {site.founder} · {site.company} · MIT licensed
          </p>
        </div>
        <nav aria-label="Learn">
          <p className="eyebrow mb-4">Learn</p>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li><Link href="/paths" className="hover:text-neon inline-flex items-center gap-2"><IconTerminal size={15} />Learning paths</Link></li>
            <li><Link href="/leaderboard" className="hover:text-neon inline-flex items-center gap-2"><IconCrown size={15} />Rankings</Link></li>
            <li><Link href="/lab" className="hover:text-neon inline-flex items-center gap-2"><IconTerminal size={15} />Terminal lab</Link></li>
            <li><Link href="/certificates" className="hover:text-neon">Certificates</Link></li>
          </ul>
        </nav>
        <nav aria-label="Trust">
          <p className="eyebrow mb-4">Trust</p>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            <li><Link href="/ethics" className="hover:text-neon inline-flex items-center gap-2"><IconShield size={15} />Ethics pledge</Link></li>
            <li><Link href="/verify" className="hover:text-neon">Verify a certificate</Link></li>
            <li><a href="https://github.com/h4ack3r-80y/can-you-hack" target="_blank" rel="noreferrer" className="hover:text-neon">Open source on GitHub</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
