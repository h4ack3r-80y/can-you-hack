import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import ReportBuilder from "@/components/ReportBuilder";

export default async function ReportPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Pentest report builder</h1>
      <p className="text-zinc-400 text-sm mb-6">Clients pay for the report. Build yours from your lab findings.</p>
      <ReportBuilder />
    </main>
  );
}
