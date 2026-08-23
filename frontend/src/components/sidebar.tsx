import Link from "next/link";
import { Home, List, Store, Settings, Activity } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-teal-400 mb-8 bg-teal-950/50 w-fit px-3 py-1.5 rounded-full border border-teal-800/50 backdrop-blur-sm">
          <Activity className="h-4 w-4" />
          <span>Anawiser</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium">
          <Home className="h-4 w-4 text-slate-400" />
          Home
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium">
          <List className="h-4 w-4 text-slate-400" />
          Your list
        </Link>
        <Link href="/local-admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium">
          <Store className="h-4 w-4 text-slate-400" />
          <span className="flex-1">Want to grow sells? Upload your product details</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium">
          <Settings className="h-4 w-4 text-slate-400" />
          Settings
        </Link>
      </nav>
    </aside>
  );
}
