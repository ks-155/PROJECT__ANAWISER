import Link from "next/link";
import { Home, Store } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-white">
      <div className="p-6 font-mono text-xs uppercase tracking-widest text-teal-400">Anawiser</div>
      <nav className="space-y-2 px-4">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-slate-800">
          <Home className="h-4 w-4 text-slate-400" />
          Home
        </Link>
        <Link href="/local-admin" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-slate-800">
          <Store className="h-4 w-4 text-slate-400" />
          Add local store prices
        </Link>
      </nav>
    </aside>
  );
}
