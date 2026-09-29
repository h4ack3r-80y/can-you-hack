import Link from "next/link";

export default function EthicsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <p className="font-mono text-sm text-neon-dim mb-3">⚖️ THE PLEDGE</p>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">The hacker ethic</h1>
      <div className="lesson-md border border-edge rounded-xl p-6 md:p-8 bg-panel">
        <h2>The one rule</h2>
        <blockquote>
          Only test systems you own or have <strong>written permission</strong> to test.
        </blockquote>
        <p>
          Everything you learn on "Can you Hack?" — reconnaissance, exploitation, forensics,
          traffic analysis — is taught in a <strong>simulated lab</strong>. The techniques are
          real. The targets are fictional. Using these techniques against real systems without
          authorization is a crime — in Pakistan under the Prevention of Electronic Crimes Act
          2016, and under computer-misuse laws almost everywhere else.
        </p>
        <h2>What ethical hackers do</h2>
        <ul>
          <li>Get <strong>written authorization</strong> defining exactly what may be tested — before touching anything.</li>
          <li>Respect the <strong>scope</strong>: if it's not in the contract, it's off limits.</li>
          <li><strong>Document everything</strong> — your notes become the report the client pays for.</li>
          <li><strong>Disclose responsibly</strong>: report vulnerabilities to the owner, never exploit them for gain or bragging rights.</li>
          <li>Protect <strong>client data</strong> as carefully as the client's systems.</li>
        </ul>
        <h2>Why this matters for your career</h2>
        <p>
          Employers don't just hire skill — they hire <strong>trust</strong>. A track record of
          ethical, authorized work (labs like this one, CTFs, bug bounties with permission) is
          what turns a student into a professional. One unauthorized "test" can end a career
          before it starts.
        </p>
        <h2>Your pledge</h2>
        <p>
          By creating an account, you pledged to use these skills only on systems you own or
          have written permission to test. Hold that line — it's what separates hackers from
          criminals.
        </p>
      </div>
      <div className="text-center mt-8">
        <Link href="/paths" className="inline-block bg-neon text-black font-bold px-8 py-3.5 rounded-lg hover:bg-neon-dim min-h-[52px]">
          I understand — start learning
        </Link>
      </div>
    </main>
  );
}
