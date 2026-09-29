import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getPaths } from "@/lib/content";
import AdminEditor from "@/components/AdminEditor";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) redirect("/dashboard");

  const paths = await getPaths();
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <p className="font-mono text-xs text-yellow-300 mb-2">FOUNDER ONLY</p>
      <h1 className="text-3xl font-bold mb-2">Content editor</h1>
      <p className="text-zinc-400 mb-8 text-sm">
        Edit any lesson, quiz, or lab. Changes go live immediately — no code changes, no rebuild.
        Brand assets live in <code className="font-mono">config/site.ts</code>, <code className="font-mono">public/logo.png</code>, <code className="font-mono">public/signature.svg</code>.
      </p>
      <AdminEditor paths={paths.map((p) => ({ id: p.id, title: p.title, modules: p.modules.map((m) => ({ id: m.id, title: m.title })) }))} />
    </main>
  );
}
