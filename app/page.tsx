import Link from "next/link";
import Image from "next/image";
import { getPaths } from "@/lib/content";
import { site } from "@/config/site";
import HeroTerminal from "@/components/HeroTerminal";
import Reveal from "@/components/Reveal";
import {
  CATEGORY_STYLE, IconArrowRight, IconBolt, IconCheck, IconShield,
  IconTrophy, IconTerminal, IconBook, IconFlag, IconCrown, IconSpark,
} from "@/components/icons";

const CATEGORIES = ["Pentesting", "Forensics", "Network Analysis"] as const;

const CATEGORY_COPY: Record<string, { blurb: string; skills: string[] }> = {
  Pentesting: {
    blurb: "Think like an attacker to defend like a pro. Recon, enumeration, and manual exploitation — every technique on systems built for you to break.",
    skills: ["nmap recon", "vsftpd backdoor", "Samba RCE", "Tomcat deploy", "privesc"],
  },
  Forensics: {
    blurb: "Become a digital detective. Recover deleted evidence, read file secrets, carve hidden data, and build timelines that prove what happened.",
    skills: ["file analysis", "strings & hex", "EXIF data", "carving", "timelines"],
  },
  "Network Analysis": {
    blurb: "See the invisible. Capture packets, spot scans, hunt beacons, and catch data exfiltration hiding inside innocent-looking DNS.",
    skills: ["pcap reading", "port scans", "beaconing", "DNS exfil", "threat hunting"],
  },
};

export default async function Home() {
  const paths = await getPaths();
  const moduleCount = paths.reduce((a, p) => a + p.modules.length, 0);

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden
          style={{ background: "radial-gradient(900px 420px at 50% -80px, var(--hero-glow), transparent 70%)" }} />
        <div className="max-w-7xl mx-auto px-4 pt-14 md:pt-20 pb-14 grid lg:grid-cols-2 gap-12 items-center relative">
          <div>
            <p className="anim-fade-up font-mono text-sm text-neon-dim mb-5 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-neon anim-glow" />$ whoami → future hacker
            </p>
            <h1 className="anim-fade-up delay-1 text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.02]">
              Can you{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-dim via-neon to-neon-dim anim-gradient">Hack?</span>
            </h1>
            <p className="anim-fade-up delay-2 text-lg md:text-xl text-zinc-400 mt-6 max-w-xl leading-relaxed">
              {site.tagline} A free, open-source hacking lab for cybersecurity students —
              pentesting, forensics, and network analysis from absolute zero to intermediate,
              right in your browser. No installs. No VMs. No excuses.
            </p>
            <div className="anim-fade-up delay-3 flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/signup" className="btn-primary text-lg justify-center">
                <IconBolt size={20} /> Start hacking — free
              </Link>
              <Link href="/paths" className="btn-ghost text-lg justify-center">
                <IconBook size={20} /> Browse learning paths
              </Link>
            </div>
            <div className="anim-fade-up delay-4 flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-zinc-500">
              {[
                ["6 guided paths", IconBook],
                [`${moduleCount} hands-on modules`, IconTerminal],
                ["Verifiable certificates", IconTrophy],
                ["100% free forever", IconCheck],
              ].map(([label, Ic]) => {
                const I = Ic as typeof IconCheck;
                return <span key={label as string} className="inline-flex items-center gap-1.5"><I size={16} className="text-neon" />{label as string}</span>;
              })}
            </div>
          </div>
          <div className="anim-fade-up delay-2">
            <HeroTerminal />
          </div>
        </div>
      </section>

      {/* ============ SKILLS MARQUEE ============ */}
      <div className="border-y border-edge py-3.5 overflow-hidden" style={{ background: "var(--bg-soft)" }} aria-hidden>
        <div className="flex gap-10 whitespace-nowrap anim-marquee w-max font-mono text-sm text-zinc-500">
          {Array.from({ length: 2 }).flatMap((_, r) =>
            ["nmap", "telnet", "netcat", "tshark", "forensics", "threat hunting", "report writing", "ethics first",
             "password attacks", "packet analysis", "malware triage", "privilege escalation"].map((s, i) => (
              <span key={`${r}-${i}`} className="inline-flex items-center gap-10">
                <span className="text-neon">▸</span> {s}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ============ CATEGORIES (separated) ============ */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <Reveal className="text-center mb-12">
          <p className="eyebrow mb-3">Three disciplines</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Pick your battlefield</h2>
          <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">Each discipline is its own world with a distinct path from beginner to intermediate — plus hands-on challenge rooms in the style of real CTF platforms.</p>
        </Reveal>

        <div className="space-y-8">
          {CATEGORIES.map((cat, ci) => {
            const style = CATEGORY_STYLE[cat];
            const CatIcon = style.icon;
            const catPaths = paths.filter((p) => p.track === cat);
            const copy = CATEGORY_COPY[cat];
            return (
              <Reveal key={cat} delay={ci * 90}>
                <article className="card card-hover overflow-hidden">
                  <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${style.color}, transparent)` }} aria-hidden />
                  <div className="p-6 md:p-8 grid md:grid-cols-[1fr_1.4fr] gap-8">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="p-3.5 rounded-2xl anim-float-soft" style={{ background: style.soft, color: style.color }}>
                          <CatIcon size={30} />
                        </span>
                        <div>
                          <p className="font-mono text-xs font-bold tracking-[.2em] uppercase" style={{ color: style.color }}>{cat}</p>
                          <h3 className="text-2xl font-extrabold tracking-tight">{style.label}</h3>
                        </div>
                      </div>
                      <p className="text-zinc-500 leading-relaxed mb-5">{copy.blurb}</p>
                      <div className="flex flex-wrap gap-2">
                        {copy.skills.map((s) => (
                          <span key={s} className="chip">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {catPaths.map((p) => (
                        <Link key={p.id} href={`/paths/${p.id}`}
                          className="group rounded-xl border border-edge p-5 transition-all hover:-translate-y-1"
                          style={{ background: "var(--bg-soft)" }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="chip" style={p.level === "Beginner" ? undefined : { borderColor: `${style.color}66`, color: style.color }}>
                              {p.level}
                            </span>
                            <IconArrowRight size={18} className="text-zinc-600 group-hover:text-neon group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="font-bold text-lg leading-snug">{p.title}</p>
                          <p className="text-sm text-zinc-500 mt-1.5 line-clamp-2">{p.tagline}</p>
                          <p className="font-mono text-xs text-zinc-600 mt-3">{p.modules.length} modules</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-16 md:py-20 border-y border-edge" style={{ background: "var(--bg-soft)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Zero to hacker in three steps</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: IconBook, title: "Learn the concept", text: "Short, jargon-free lessons teach you exactly what you need — nothing you don't. Built for absolute beginners.", n: "01" },
              { icon: IconTerminal, title: "Break things in the lab", text: "A simulated Kali terminal runs in your browser. Hack fictional machines, analyze evidence, read real-style packet captures.", n: "02" },
              { icon: IconFlag, title: "Prove it & get certified", text: "Pass quizzes, complete every module in order, and earn a verifiable certificate with QR code and LinkedIn support.", n: "03" },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="card card-hover p-7 h-full relative overflow-hidden">
                  <span className="absolute -top-2 right-4 font-mono text-7xl font-extrabold opacity-[.07] select-none" aria-hidden>{s.n}</span>
                  <span className="inline-flex p-3 rounded-xl bg-neon/10 text-neon mb-5"><s.icon size={26} /></span>
                  <h3 className="text-xl font-bold mb-2.5">{s.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CHALLENGE ROOMS ============ */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <Reveal>
          <div className="card overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none" aria-hidden
              style={{ background: "radial-gradient(700px 300px at 85% 20%, var(--hero-glow), transparent 70%)" }} />
            <div className="p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center relative">
              <div>
                <p className="eyebrow mb-3">New · Challenge rooms</p>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">CTF-style rooms, zero setup</h2>
                <p className="text-zinc-500 leading-relaxed mb-6">
                  Story-driven missions in the style of popular hacking platforms — a suspicious USB stick,
                  a 3 AM SOC alert, an insider threat. Every room runs in your browser with tasks,
                  hints, and flags to capture. Built into every path.
                </p>
                <Link href="/paths" className="btn-primary"><IconFlag size={18} /> Enter the rooms</Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Night Shift", "The USB Drop", "3 AM Alert", "Double Tap", "The Insider", "Threat Hunt"].map((r, i) => (
                  <div key={r} className={`rounded-xl border border-edge p-4 font-mono text-sm ${i % 2 ? "translate-y-3" : ""}`}
                    style={{ background: "var(--bg-soft)" }}>
                    <span className="text-neon">⚑</span> <span className="text-zinc-300">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ FOUNDER ============ */}
      <section className="py-16 md:py-24 border-t border-edge" style={{ background: "var(--bg-soft)" }}>
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-[340px_1fr] gap-10 md:gap-14 items-center">
          <Reveal>
            <div className="relative mx-auto w-72 md:w-full max-w-[340px]">
              <div className="absolute -inset-3 rounded-[2rem] opacity-60 blur-2xl"
                style={{ background: "linear-gradient(135deg, var(--accent), #0ea5e9, var(--accent))" }} aria-hidden />
              <Image src={site.founderPhoto} alt={`${site.founder}, founder of ${site.company}`}
                width={680} height={680} sizes="(max-width: 768px) 288px, 340px"
                className="relative rounded-[2rem] object-cover aspect-square border border-edge anim-float" />
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap card px-5 py-2.5 flex items-center gap-2">
                <IconCrown size={18} className="text-neon" />
                <span className="font-bold text-sm">{site.founder}</span>
                <span className="text-zinc-500 text-xs">· {site.founderTitle}</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow mb-3">Meet the founder</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              Talent is everywhere.<br />Opportunity is <span className="text-neon">not.</span>
            </h2>
            <div className="space-y-4 text-zinc-400 leading-relaxed text-[1.05rem]">
              {site.founderMessage.map((para, i) => (
                <p key={i} className={i === 0 ? "text-lg text-zinc-300 font-medium" : ""}>{para}</p>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/signup" className="btn-primary"><IconSpark size={18} /> Start your journey</Link>
              <Link href="/paths" className="btn-ghost">See the paths <IconArrowRight size={18} /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ ETHICS + CTA ============ */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <Reveal className="text-center">
          <span className="inline-flex p-4 rounded-2xl bg-neon/10 text-neon mb-6"><IconShield size={32} /></span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Power demands responsibility</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-8">
            Every student signs an ethics pledge: only hack systems you own or have explicit permission to test.
            These skills open careers — use them to protect, never to harm.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn-primary text-lg"><IconBolt size={20} /> Join free today</Link>
            <Link href="/ethics" className="btn-ghost text-lg">Read the ethics pledge</Link>
          </div>
          <p className="font-mono text-xs text-zinc-600 mt-8">Open source · MIT licensed · Made with obsession by {site.founder}</p>
        </Reveal>
      </section>
    </main>
  );
}
