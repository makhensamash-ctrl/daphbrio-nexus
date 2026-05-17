import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/news")({
  head: () => ({ meta: [{ title: "News — Daph Brio CMS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: NewsAdmin,
});

type Post = {
  id: string; title: string; slug: string; category: string;
  summary: string; body: string; cover_url: string | null; published_at: string;
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

function NewsAdmin() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin_news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    const category = String(fd.get("category") || "News").trim();
    const summary = String(fd.get("summary") || "").trim();
    const body = String(fd.get("body") || "").trim();
    const cover_url = String(fd.get("cover_url") || "").trim() || null;
    const published_at = String(fd.get("published_at") || new Date().toISOString().slice(0, 10));
    if (title.length < 3) { toast.error("Title is required"); return; }

    const payload = {
      title,
      slug: editing ? editing.slug : slugify(title) || crypto.randomUUID().slice(0, 8),
      category, summary, body, cover_url,
      published_at: new Date(published_at).toISOString(),
    };

    const { error } = editing
      ? await supabase.from("news_posts").update(payload).eq("id", editing.id)
      : await supabase.from("news_posts").insert(payload);

    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Post updated" : "Post published");
    setOpen(false); setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin_news"] });
    qc.invalidateQueries({ queryKey: ["news_posts"] });
    qc.invalidateQueries({ queryKey: ["admin_stats"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("news_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin_news"] });
    qc.invalidateQueries({ queryKey: ["news_posts"] });
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">News & Insights</h1>
          <p className="mt-1 text-muted-foreground">Publish blog updates and contract wins.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}><Plus className="h-4 w-4 mr-1.5" /> New post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "Edit post" : "New post"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-1.5"><Label>Title</Label><Input name="title" defaultValue={editing?.title} required /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Category</Label><Input name="category" defaultValue={editing?.category ?? "News"} /></div>
                <div className="space-y-1.5"><Label>Date</Label><Input name="published_at" type="date" defaultValue={(editing?.published_at ?? new Date().toISOString()).slice(0, 10)} /></div>
              </div>
              <div className="space-y-1.5"><Label>Cover image URL (optional)</Label><Input name="cover_url" defaultValue={editing?.cover_url ?? ""} placeholder="https://…" /></div>
              <div className="space-y-1.5"><Label>Summary</Label><Textarea name="summary" rows={2} defaultValue={editing?.summary} /></div>
              <div className="space-y-1.5"><Label>Body</Label><Textarea name="body" rows={8} defaultValue={editing?.body} /></div>
              <DialogFooter><Button type="submit">{editing ? "Save changes" : "Publish"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-sm text-muted-foreground">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No posts yet — create your first one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{p.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(p.published_at).toLocaleDateString("en-ZA")}</td>
                  <td className="px-5 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
