import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import PasswordChange from "@/components/PasswordChange";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <div className="border border-edge rounded-xl p-6 bg-panel mb-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-zinc-500">Name</dt><dd className="font-semibold">{user.name}</dd></div>
          <div className="flex justify-between"><dt className="text-zinc-500">Email</dt><dd className="font-mono">{user.email}</dd></div>
          <div className="flex justify-between"><dt className="text-zinc-500">Role</dt><dd>{user.isAdmin ? "Founder (admin)" : "Student"}</dd></div>
        </dl>
        <p className="text-xs text-zinc-600 mt-3">This name appears on your certificates — contact support to change it.</p>
      </div>
      <PasswordChange />
    </main>
  );
}
