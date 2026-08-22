import { AnawiserDashboard } from "@/components/stock-radar-dashboard";

export default function Home() {
  return (
    <main className="flex-1 bg-slate-50 min-h-screen">
      <AnawiserDashboard />
    </main>
  );
}
