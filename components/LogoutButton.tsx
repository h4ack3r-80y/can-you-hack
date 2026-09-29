"use client";

export default function LogoutButton() {
  return (
    <button
      className="text-zinc-400 hover:text-white text-sm"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
      }}
    >
      Log out
    </button>
  );
}
