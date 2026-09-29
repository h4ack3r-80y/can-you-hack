import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-edge mt-16 no-print">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-sm text-zinc-400">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image src="/logo.png" alt="Tech Sol logo" width={28} height={28} className="rounded-lg" />
            <span className="font-mono font-bold text-white">Can you <span className="text-neon">Hack?</span></span>
          </div>
          <p>Free, open-source cybersecurity education. From zero to intermediate — legally.</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Learn</p>
          <ul className="space-y-2">
            <li><Link href="/paths" className="hover:text-white">Learning paths</Link></li>
            <li><Link href="/lab" className="hover:text-white">Terminal lab</Link></li>
            <li><Link href="/verify" className="hover:text-white">Verify a certificate</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Project</p>
          <ul className="space-y-2">
            <li><Link href="/ethics" className="hover:text-white">Ethics pledge</Link></li>
            <li><span>Founded by Shayan Ahmad — Tech Sol</span></li>
            <li><span className="font-mono text-xs">MIT licensed · open source</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-edge py-4 text-center text-xs text-zinc-600 font-mono">
        Only test systems you own or have permission to test.
      </div>
    </footer>
  );
}
