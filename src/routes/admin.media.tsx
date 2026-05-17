import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/media")({
  head: () => ({ meta: [{ title: "Media Manager — Daph Brio CMS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: MediaAdmin,
});

type Item = { id: string; title: string; category: string; image_url: string; caption: string | null };

const CATEGORIES = ["IT Cabling", "Fiber Splicing", "Cable Trays", "LAN Networks", "Electrical", "CCTV / Security"];

function MediaAdmin() {
  const qc = useQueryClient();
  const dropRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["admin_gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Item[];
    },
  });

  function readFile(f: File) {
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result || ""));
    reader.readAsDataURL(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); dropRef.current?.classList.remove("ring-2", "ring-primary");
    const f = e.dataTransfer.files?.[0]; if (f) readFile(f);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!preview) { toast.error("Drop or pick an image first"); return; }
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") || "").trim();
    const category = String(fd.get("category") || CATEGORIES[0]);
    const caption = String(fd.get("caption") || "").trim();
    if (title.length < 2) { toast.error("Title required"); return; }
    setBusy(true);
    // Store the image as a data URL in the DB (mock-upload behaviour per spec — no storage bucket required).
    const { error } = await supabase.from("gallery_items").insert({ title, category, caption, image_url: preview });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Added to live gallery");
    (e.target as HTMLFormElement).reset();
    setPreview("");
    qc.invalidateQueries({ queryKey: ["admin_gallery"] });
    qc.invalidateQueries({ queryKey: ["gallery_items"] });
    qc.invalidateQueries({ queryKey: ["admin_stats"] });
  }

  async function remove(id: string) {
    if (!confirm("Remove this image from the live gallery?")) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    qc.invalidateQueries({ queryKey: ["admin_gallery"] });
    qc.invalidateQueries({ queryKey: ["gallery_items"] });
  }

  return (
    <AdminShell>
      <div>
        <h1 className="font-display text-3xl font-bold">Media Manager</h1>
        <p className="mt-1 text-muted-foreground">Upload installation photos straight to the live public gallery.</p>
      </div>

      <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div
          ref={dropRef}
          onDragOver={(e) => { e.preventDefault(); dropRef.current?.classList.add("ring-2", "ring-primary"); }}
          onDragLeave={() => dropRef.current?.classList.remove("ring-2", "ring-primary")}
          onDrop={onDrop}
          className="relative rounded-xl border-2 border-dashed border-border bg-card p-6 flex items-center justify-center min-h-[280px] transition"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-[280px] rounded-lg object-contain" />
          ) : (
            <div className="text-center">
              <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-3 font-display font-semibold">Drag & drop an image</p>
              <p className="text-xs text-muted-foreground mt-1">or click to pick a file</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f); }}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Title</Label><Input name="title" required placeholder="Plant fibre upgrade — Ford" /></div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <select name="category" defaultValue={CATEGORIES[0]} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5"><Label>Caption (optional)</Label><Input name="caption" placeholder="Short description" /></div>
          <Button type="submit" disabled={busy} className="w-full">{busy ? "Uploading…" : "Append to live gallery"}</Button>
        </div>
      </form>

      <h2 className="mt-12 font-display text-xl font-bold">Live gallery items ({items.length})</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <figure key={it.id} className="rounded-lg overflow-hidden border border-border bg-card shadow-card">
            <img src={it.image_url} alt={it.title} className="aspect-[4/3] w-full object-cover" />
            <figcaption className="p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.16em] text-primary font-semibold">{it.category}</p>
                <p className="text-sm font-semibold truncate">{it.title}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => remove(it.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </figcaption>
          </figure>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground py-8">No uploads yet. Seed photos still appear on the public gallery.</p>
        )}
      </div>
    </AdminShell>
  );
}
