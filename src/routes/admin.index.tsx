import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Image as ImageIcon, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Daph Brio CMS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const [posts, gallery] = await Promise.all([
        supabase.from("news_posts").select("id", { count: "exact", head: true }),
        supabase.from("gallery_items").select("id", { count: "exact", head: true }),
      ]);
      return { posts: posts.count ?? 0, gallery: gallery.count ?? 0 };
    },
  });

  return (
    <AdminShell>
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Live overview of public content.</p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="News posts" value={stats?.posts ?? "—"} icon={Newspaper} to="/admin/news" />
        <StatCard label="Gallery items" value={stats?.gallery ?? "—"} icon={ImageIcon} to="/admin/media" />
        <div className="rounded-xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Quick links</p>
          <div className="mt-4 space-y-2">
            <Link to="/admin/news" className="block text-sm font-semibold text-primary hover:underline">Create news post →</Link>
            <Link to="/admin/media" className="block text-sm font-semibold text-primary hover:underline">Upload gallery image →</Link>
            <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground">View public site →</Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value, icon: Icon, to }: { label: string; value: number | string; icon: typeof Newspaper; to: string }) {
  return (
    <Link to={to} className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-elevated transition group">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-md gradient-hero text-white">
          <Icon className="h-5 w-5" />
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
      </div>
      <p className="mt-5 font-display text-3xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </Link>
  );
}
